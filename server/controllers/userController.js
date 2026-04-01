import bcrypt from 'bcrypt';
import ApiError from '../error/ApiError.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';


export const registration = async (req, res, next) => {
 try {
   const { email, password, userType, username } = req.body;


   if (!email || !password) {
     return next(ApiError.badRequest('Некорректный email или password'));
   }


   const candidate = await User.findOne({ where: { email } });
   if (candidate) {
     return next(ApiError.badRequest('Пользователь с таким email уже существует'));
   }


   const avatarImage = `/static/${req.file.filename}`;


   const hashPassword = await bcrypt.hash(password, 5);


   const user = await User.create({
     email,
     userType,
     username,
     avatar: avatarImage,
     password: hashPassword
   });

   const getBaseUrl = () => `${process.env.HOST}:${process.env.PORT || 5000}`;
   const baseUrl = getBaseUrl();
   let avatarUrl = user.avatar;
   if (avatarUrl && !avatarUrl.startsWith('http')) {
     avatarUrl = `${baseUrl}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
   }


   
   res.json({
     user: {
       id: user.id,
       email: user.email,
       username: user.username,
       avatarUrl: avatarUrl,
       isPro: user.userType === 'pro'
     }
   });
 } catch (error) {
   next(ApiError.internal('Ошибка регистрации'));
 }
};

export const login = async (req, res, next) => {
 try {
   const { email, password } = req.body;


   const user = await User.findOne({ where: { email } });
   if (!user) return next(ApiError.badRequest('Пользователь не найден'));


   const isValid = await bcrypt.compare(password, user.password);
   if (!isValid) return next(ApiError.badRequest('Неверный пароль'));


   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });


   res.json({ token });
 } catch (error) {
   next(ApiError.internal('Ошибка авторизации'));
 }
};

 export const checkAuth = (req, res) => {
 const user = req.user;


 const token = jwt.sign(
   {
     id: user.id,
     email: user.email,
     username: user.username,
     userType: user.userType,
     avatar: user.avatar
   },
   process.env.JWT_SECRET,
   { expiresIn: '24h' }
 );
const getBaseUrl = () => `${process.env.HOST}:${process.env.PORT || 5000}`;
const baseUrl = getBaseUrl();
let name = user.avatar
if (name && !name.startsWith('http')) {
    name = `${baseUrl}${name.startsWith('/') ? '' : '/'}${name}`;
  }
 return res.json({
   id: user.id,
   email: user.email,
   username: user.username,
   avatar: name,
   isPro: user.userType === 'pro',
   token
 });
};

export const logout = (req, res) =>{
  res.status(204).send();
}


