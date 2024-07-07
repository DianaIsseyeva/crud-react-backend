## Установка и запуск

### Локально

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/DianaIsseyeva/crud-react-backend.git
   cd react-crud-backend
   ```

### Установка зависимостей
Установите зависимости
```bash
npm install
```

### Запуск сервера
Запустите сервер:
```bash
npm start
```

### Запуск с Docker
### Создание Docker образа и запуск контейнера

- Перейдите в папку проекта:
  ```bash
  cd react-crud-backend
  ```
- Постройте Docker образ для бэкенда:
  ```bash
  docker build -t backend-app .
  ```
- Запустите Docker контейнер для бэкенда:
  ```bash
  docker run -p 8000:8000 backend-app
  ```

  Сервер будет запущен на http://localhost:8000
  
