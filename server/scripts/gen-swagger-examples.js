import fs from "fs";
import { faker } from "@faker-js/faker";
import YAML from "yaml";

const SWAGGER_PATH = "docs/swagger.yaml";

function genLoginExample() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
  };
}

function genRegisterExample() {
  return {
    email: faker.internet.email(),
    userType: faker.helpers.arrayElement(["normal", "pro"]),
    username: faker.internet.username(),
    password: faker.internet.password({ length: 10 }),
    avatar: faker.image.avatar(),
  };
}

function genOfferExample() {
  const features = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'];
  const randomFeatures = faker.helpers.arrayElements(features, faker.number.int({ min: 2, max: 5 }));
  
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    publishDate: faker.date.recent().toISOString().slice(0, 10),
    city: faker.location.city(),
    isPremium: faker.datatype.boolean(),
    isFavorite: faker.datatype.boolean(),
    rating: Number(faker.number.float({ min: 1, max: 5, fractionDigits: 1 })),
    type: faker.helpers.arrayElement(["apartment", "house", "room", "hotel"]),
    rooms: faker.number.int({ min: 1, max: 5 }),
    guests: faker.number.int({ min: 1, max: 8 }),
    price: faker.number.int({ min: 50, max: 500 }),
    features: JSON.stringify(randomFeatures),
    commentsCount: faker.number.int({ min: 0, max: 50 }),
    latitude: Number(faker.location.latitude()),
    longitude: Number(faker.location.longitude()),
    userId: faker.number.int({ min: 1, max: 10 }),
    previewImage: "image.jpg",
    photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"]
  };
}

function genCommentExample() {
  return {
    comment: faker.lorem.sentences(2),
    rating: faker.number.int({ min: 1, max: 5 }),
  };
}

function addPathParameters() {
  const paths = doc.paths;
  
  if (paths["/comments/{id}"]) {
    const commentPath = paths["/comments/{id}"];
    const parameterExample = {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string"
      },
      example: faker.string.alphanumeric(24), // MongoDB-like ID
      description: "ID оффера"
    };
    
    ["get", "post"].forEach(method => {
      if (commentPath[method]) {
        if (!commentPath[method].parameters) {
          commentPath[method].parameters = [];
        }
        const hasParam = commentPath[method].parameters.some(p => p.name === "id");
        if (!hasParam) {
          commentPath[method].parameters.push(parameterExample);
        }
      }
    });
    console.log("Добавлены path parameters для /comments/{id}");
  }
  
  if (paths["/favorite/{id}/{option}"]) {
    const favoritePath = paths["/favorite/{id}/{option}"];
    
    const idParameter = {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string"
      },
      example: faker.number,
      description: "ID оффера"
    };
    
    const optionParameter = {
      name: "option",
      in: "path",
      required: true,
      schema: {
        type: "string",
        enum: ["1", "0"]
      },
      example: faker.helpers.arrayElement(["1", "0"]),
      description: "1 - добавить в избранное, 0 - удалить из избранного"
    };
    
    if (favoritePath.post) {
      if (!favoritePath.post.parameters) {
        favoritePath.post.parameters = [];
      }
      
      const hasIdParam = favoritePath.post.parameters.some(p => p.name === "id");
      const hasOptionParam = favoritePath.post.parameters.some(p => p.name === "option");
      
      if (!hasIdParam) favoritePath.post.parameters.push(idParameter);
      if (!hasOptionParam) favoritePath.post.parameters.push(optionParameter);
    }
    console.log("Добавлены path parameters для /favorite/{id}/{option}");
  }
  
  if (paths["/offers/{id}"]) {
    const offersPath = paths["/offers/{id}"];
    
    const idParameter = {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string"
      },
      example: faker.string.alphanumeric(24),
      description: "ID оффера"
    };
    
    if (offersPath.get) {
      if (!offersPath.get.parameters) {
        offersPath.get.parameters = [];
      }
      
      const hasIdParam = offersPath.get.parameters.some(p => p.name === "id");
      if (!hasIdParam) {
        offersPath.get.parameters.push(idParameter);
      }
    }
    console.log("Добавлены path parameters для /offers/{id}");
  }
  
  if (paths["/static/{path}"]) {
    const staticPath = paths["/static/{path}"];
    
    const pathParameter = {
      name: "path",
      in: "path",
      required: true,
      schema: {
        type: "string"
      },
      example: "images/apartment-123.jpg",
      description: "Путь к изображению"
    };
    
    if (staticPath.get) {
      if (!staticPath.get.parameters) {
        staticPath.get.parameters = [];
      }
      
      const hasPathParam = staticPath.get.parameters.some(p => p.name === "path");
      if (!hasPathParam) {
        staticPath.get.parameters.push(pathParameter);
      }
    }
    console.log("Добавлены path parameters для /static/{path}");
  }
}

const raw = fs.readFileSync(SWAGGER_PATH, "utf-8");
const doc = YAML.parse(raw);

const loginContent = doc?.paths?.["/login"]?.post?.requestBody?.content?.["application/json"];
if (loginContent) {
  loginContent.example = genLoginExample();
  console.log("Пример для POST /login обновлен");
}

const registerContent = doc?.paths?.["/register"]?.post?.requestBody?.content?.["application/json"];
if (registerContent) {
  registerContent.example = genRegisterExample();
  console.log("Пример для POST /register обновлен");
}

const offerContent = doc?.paths?.["/offers"]?.post?.requestBody?.content?.["multipart/form-data"];
if (offerContent) {
  if (!offerContent.examples) {
    offerContent.examples = {};
  }
  
  offerContent.examples.generated = {
    summary: "Сгенерированный пример предложения",
    value: genOfferExample(),
  };
  console.log("Пример для POST /offers обновлен");
}

const commentContent = doc?.paths?.["/comments/{id}"]?.post?.requestBody?.content?.["application/json"];
if (commentContent) {
  commentContent.example = genCommentExample();
  console.log("Пример для POST /comments/{id} обновлен");
}

addPathParameters();

fs.writeFileSync(SWAGGER_PATH, YAML.stringify(doc), "utf-8");

console.log("\nГотово! Все примеры и path parameters обновлены в", SWAGGER_PATH);