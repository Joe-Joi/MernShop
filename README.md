# Southampton Book Exchange Platform

### Env Variables

Create a .env file in root and add the configs below

```
NODE_ENV = development
PORT = 5000
MONGO_URI = mongodb uri
JWT_SECRET = 'abc123'
```

### Install Dependencies

```
npm install
cd frontend
npm install
```

### Run

```
# Run both frontend (:3000) & backend (:5000)
npm run dev

# Run backend only
npm run server
```

## Build & Deploy

```
# Create frontend prod build
cd frontend
npm run build
```
