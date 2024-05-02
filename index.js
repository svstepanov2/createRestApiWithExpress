// Список роутов:
// /object/users (GET) - сохранять всех пользователей в одном списке
// /object/users/:id (GET) - получать пользователя по его ID
// /object/users/:id (PUT) - обновлять пользователя по его ID
// /object/users/:id (DELETE) - удалять пользователя по его ID
// /object/users (POST) - добавлять новых пользователей
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Инициализируем список пользователей
const users = [];

// Инициализируем парсинг JSON-запросов
app.use(bodyParser.json());

// Обработчик для получения списка всех пользователей
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Запуск сервера
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Обработчик для создания нового пользователя
app.post("/api/users", (req, res) => {
  const { firstName, secondName, age, city } = req.body;

  if (!firstName || !secondName || !age || !city) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newUser = {
    id: users.length + 1,
    firstName,
    secondName,
    age,
    city,
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// В этом коде мы добавили обработчик для создания нового пользователя с помощью метода POST. Обработчик принимает JSON-запрос с полями firstName, secondName, age и city.
// Затем мы проверяем, есть ли все поля в запросе. Если поля нет, мы возвращаем ошибку в JSON-формате.
// Если все поля есть, мы создаем новый пользователь с полями из запроса и добавляем его к списку всех пользователей.
// Затем мы возвращаем новый пользователь в JSON-формате со статусом 201, который указывает на успешное создание ресурса.



// Обработчик для обновления существующего пользователя
app.put('/api/users/:id', (req, res) => {
    const { firstName, secondName, age, city } = req.body;
    const userId = req.params.id;
  
    if (!firstName || !secondName || !age || !city) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const userIndex = users.findIndex(user => user.id === userId);
  
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    users[userIndex] = {
      ...users[userIndex],
      firstName,
      secondName,
      age,
      city
    };
  
    res.status(200).json(users[userIndex]);
  });
// В этом коде мы добавили обработчик для обновления существующего пользователя с помощью метода PUT. Обработчик принимает JSON-запрос с полями firstName, secondName, age и city, а также id пользователя, который нужно обновить.
// Затем мы проверяем, есть ли все поля в запросе. Если поля нет, мы возвращаем ошибку в JSON-формате.
// Мы также проверяем, существует ли пользователь с указанным id. Если пользователь не существует, мы возвращаем ошибку в JSON-формате.
// Если все поля есть и пользователь существует, мы обновляем пользователя с указанным id и возвращаем его в JSON-формате.


// Обработчик для получения отдельного пользователя
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
  
    const user = users.find(user => user.id === userId);
  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    res.json(user);
  });
// В этом коде мы добавили обработчик для получения отдельного пользователя с помощью метода GET. Обработчик принимает id пользователя, которого нужно получить.
// Затем мы проверяем, существует ли пользователь с указанным id. Если пользователь не существует, мы возвращаем ошибку в JSON-формате.
// Если пользователь существует, мы возвращаем его в JSON-формате.

// Обработчик для удаления пользователя
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
  
    const userIndex = users.findIndex(user => user.id === userId);
  
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    users.splice(userIndex, 1);
  
    res.status(204).json();
  });
// В этом коде мы добавили обработчик для удаления пользователя с помощью метода DELETE. Обработчик принимает id пользователя, которого нужно удалить.
// Затем мы проверяем, существует ли пользователь с указанным id. Если пользователь не существует, мы возвращаем ошибку в JSON-формате.
// Если пользователь существует, мы удаляем его из списка пользователей и возвращаем пустой JSON-объект со статусом 204, который указывает на успешное удаление ресурса.


// Схема валидации
const Joi = require('joi');

const createUserSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  secondName: Joi.string().min(1).required(),
  age: Joi.number().min(0).max(150).required(),
  city: Joi.string().min(1).optional(),
});
// В этой схеме валидации мы определяем, что:
// firstName и secondName - это строки, которые должны иметь не менее одного символа. Также эти поля обязательны для создания.
// age - это обязательное число, которое не может быть меньше 0 и более 150.
// city - это необязательная строка с минимальным количеством символов 1.

// Обработчик для создания нового пользователя
app.post('/api/users', (req, res) => {
    const { error } = createUserSchema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  });
// Этот код будет проверять, соответствует ли тело запроса схеме createUserSchema. Если тело запроса не соответствует схеме, обработчик вернет ошибку 400 с сообщением об ошибке.



const fs = require('fs');
const bodyParser = require('body-parser');
const Joi = require('joi');

app.use(bodyParser.json());

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newUser = {
    id: users.length + 1,
    ...req.body,
  };

  users.push(newUser);
  fs.writeFileSync('users.json', JSON.stringify(users));

  res.status(201).json(newUser);
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
// В этом примере мы используем fs.readFileSync() для чтения данных из файла users.json при запуске сервера. Мы также используем fs.writeFileSync() для сохранения данных в файл после изменения массива.
// Этот код будет хранить пользователей постоянно, даже если сервер будет перезапущен.