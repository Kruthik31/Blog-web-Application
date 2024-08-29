import express from 'express';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';

// Create an Express application
const app = express();
const PORT = 3000;

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let posts = [];

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Helper function to render content with layout
const renderWithLayout = async (res, view, locals = {}) => {
    const content = await ejs.renderFile(path.join(__dirname, 'views', `${view}.ejs`), locals);
    res.render('layout', { ...locals, content });
};

// Routes
app.get('/', async (req, res) => {
    await renderWithLayout(res, 'index', { title: 'Home', posts });
});

app.get('/new', async (req, res) => {
    await renderWithLayout(res, 'new', { title: 'New Post' });
});

app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    posts.push({ title, content });
    res.redirect('/');
});

app.get('/posts/:id/edit', async (req, res) => {
    const postId = req.params.id;
    const post = posts[postId];
    await renderWithLayout(res, 'edit', { title: 'Edit Post', postId, post });
});

app.put('/posts/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    posts[postId] = { title, content };
    res.redirect('/');
});

app.delete('/posts/:id', (req, res) => {
    const postId = req.params.id;
    posts.splice(postId, 1);
    res.redirect('/');
});

app.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const post = posts[postId];
    await renderWithLayout(res, 'show', { title: 'View Post', postId, post });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
