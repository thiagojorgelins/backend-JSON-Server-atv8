const jsonServer = require('json-server');
const auth = require('json-server-auth');
const multer = require('multer');
const fs = require('fs');
const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const rules = auth.rewriter({
    users: 660,
    products: 660,
});
app.db = router.db;

app.use(rules);
app.use(middlewares);
app.use(auth);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        let date = new Date();
        let imageFileName = date.getTime() + '_' + file.originalname;
        req.body.image = imageFileName;
        cb(null, imageFileName);
    }
});

const upload = multer({ storage: storage });

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

app.post("/products", upload.single('image'), (req, res, next) => {
    let date = new Date();
    req.body.createdAt = date.toISOString();

    if (req.body.price) {
        req.body.price = Number(req.body.price);
    }

    let hasErrors = false;
    let errors = {};

    if (!req.body.name || req.body.name.length < 2) {
        hasErrors = true;
        errors.name = "O nome do produto precisa ter mais que 2 caracteres";
    }

    if (!req.body.price || req.body.price <= 0) {
        hasErrors = true;
        errors.price = "Preço inválido";
    }

    if (!req.body.description || req.body.description.length < 10) {
        hasErrors = true;
        errors.description = "A descrição precisa ter mais que 10 caracteres";
    }

    if (hasErrors) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error("Erro ao deletar o arquivo:", err);
                }
            });
        }

        return res.status(400).json(errors);
    }

    next();
});

app.put("/products/:id", upload.single('image'), (req, res, next) => {
    let date = new Date();
    req.body.updatedAt = date.toISOString();

    if (req.body.price) {
        req.body.price = Number(req.body.price);
    }

    let hasErrors = false;
    let errors = {};

    if (!req.body.name || req.body.name.length < 2) {
        hasErrors = true;
        errors.name = "O nome do produto precisa ter mais que 2 caracteres";
    }

    if (!req.body.price || req.body.price <= 0) {
        hasErrors = true;
        errors.price = "Preço inválido";
    }

    if (!req.body.description || req.body.description.length < 10) {
        hasErrors = true;
        errors.description = "A descrição precisa ter mais que 10 caracteres";
    }

    if (hasErrors) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error("Erro ao deletar o arquivo:", err);
                }
            });
        }

        return res.status(400).json(errors);
    }

    const db = router.db;
    const product = db.get('products').find({ id: parseInt(req.params.id) }).value();

    if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
    }

    const updatedProduct = { ...product, ...req.body };

    db.get('products')
        .find({ id: parseInt(req.params.id) })
        .assign(updatedProduct)
        .write();

    res.json(updatedProduct);
});

app.post("/users", upload.single('image'), (req, res, next) => {
    let date = new Date();
    req.body.createdAt = date.toISOString();

    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    let hasErrors = false;
    let errors = {};

    if (!req.body.name || req.body.name.length < 2) {
        hasErrors = true;
        errors.name = "O nome precisa ter mais que 2 caracteres";
    }

    if (!req.body.email || !validateEmail(req.body.email)) {
        hasErrors = true;
        errors.email = "Email inválido";
    }

    if (!req.body.password || req.body.password.length < 6) {
        hasErrors = true;
        errors.password = "A senha precisa ter mais que 6 caracteres";
    }

    if (hasErrors) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error("Erro ao deletar o arquivo:", err);
                }
            });
        }

        return res.status(400).json(errors);
    }

    next();
}, (req, res) => {
    const db = router.db;
    const newUser = req.body;

    const createdUser = db.get('users').insert(newUser).write();
    res.status(201).json(createdUser);
});

app.patch("/users/:id", upload.single('image'), (req, res, next) => {
    let date = new Date();
    req.body.updatedAt = date.toISOString();

    let hasErrors = false;
    let errors = {};

    if (req.body.name && req.body.name.length < 2) {
        hasErrors = true;
        errors.name = "O nome precisa ter mais que 2 caracteres";
    }

    if (req.body.email && !validateEmail(req.body.email)) {
        hasErrors = true;
        errors.email = "Email inválido";
    }

    if (hasErrors) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error("Erro ao deletar o arquivo:", err);
                }
            });
        }

        return res.status(400).json(errors);
    }

    const db = router.db;
    const user = db.get('users').find({ id: parseInt(req.params.id) }).value();

    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const updatedUser = { ...user, ...req.body };

    db.get('users')
        .find({ id: parseInt(req.params.id) })
        .assign(updatedUser)
        .write();

    res.json(updatedUser);
});

app.use(router);

app.listen(3333, () => {
    console.log('JSON Server is running');
});
