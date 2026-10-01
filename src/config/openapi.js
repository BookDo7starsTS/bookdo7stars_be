const json = (schema) => ({
  content: {
    'application/json': { schema },
  },
});

const response = (description, schema = { type: 'object' }) => ({ description, ...json(schema) });

const errorResponse = (description) =>
  response(description, {
    type: 'object',
    properties: { message: { type: 'string' } },
  });

const pathParameter = (name, description, schema = { type: 'string' }) => ({
  name,
  in: 'path',
  required: true,
  description,
  schema,
});

const queryParameter = (name, description, schema = { type: 'string' }, required = false) => ({
  name,
  in: 'query',
  required,
  description,
  schema,
});

const requestBody = (schema) => ({ required: true, ...json(schema) });

const pagination = [
  queryParameter('page', 'Page number.', { type: 'integer', minimum: 1, default: 1 }),
  queryParameter('pageSize', 'Number of items per page.', { type: 'integer', minimum: 1, default: 20 }),
];

const bookId = pathParameter('id', 'Book ID.', { type: 'integer', example: 12 });
const categoryId = pathParameter('categoryId', 'Category ID.');
const sessionNote = 'Requires an authenticated session cookie. Sign in with POST /user/login first.';

const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'BookDo7Stars API',
    version: '1.0.0',
    description: 'Interactive API documentation for the BookDo7Stars backend.',
  },
  tags: [
    { name: 'Users', description: 'Account and session endpoints.' },
    { name: 'Books', description: 'Book discovery and detail endpoints.' },
    { name: 'Categories', description: 'Category lookup endpoints.' },
    { name: 'Cart', description: 'Authenticated cart endpoints.' },
    { name: 'Wishlist', description: 'Authenticated wishlist endpoints.' },
    { name: 'Reviews', description: 'Book review endpoints.' },
    { name: 'Orders', description: 'Authenticated order endpoints.' },
  ],
  paths: {
    '/user': {
      post: {
        tags: ['Users'],
        summary: 'Create a user',
        requestBody: requestBody({
          type: 'object',
          required: ['name', 'email', 'password', 'policyyn'],
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', format: 'password', example: 'Password123!' },
            mobile: { type: 'string', example: '010-1234-5678' },
            policyyn: { type: 'string', example: 'Y' },
            address: { type: 'string', example: '123 Main Street' },
          },
        }),
        responses: { 201: response('User created.'), 500: errorResponse('Could not create user.') },
      },
    },
    '/user/login': {
      post: {
        tags: ['Users'],
        summary: 'Sign in',
        requestBody: requestBody({
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', format: 'password', example: 'Password123!' },
          },
        }),
        responses: { 200: response('Signed in.'), 401: errorResponse('Invalid credentials.') },
      },
    },
    '/user/logout': {
      post: {
        tags: ['Users'],
        summary: 'Sign out',
        description: sessionNote,
        responses: { 200: response('Signed out.'), 500: errorResponse('Could not sign out.') },
      },
    },
    '/user/session': {
      get: {
        tags: ['Users'],
        summary: 'Get the signed-in user',
        description: sessionNote,
        responses: { 200: response('Current user.') },
      },
    },
    '/user/auth/github': {
      get: {
        tags: ['Users'],
        summary: 'Start GitHub OAuth sign-in',
        description: 'Redirects the browser to GitHub. Open this endpoint in a browser instead of using Try it out.',
        responses: { 302: { description: 'Redirect to GitHub.' } },
      },
    },
    '/user/auth/github/callback': {
      get: {
        tags: ['Users'],
        summary: 'GitHub OAuth callback',
        description: 'OAuth provider callback endpoint. It is invoked by GitHub after authorization.',
        responses: { 201: response('Signed in with GitHub.') },
      },
    },
    '/user/auth/google/callback': {
      get: {
        tags: ['Users'],
        summary: 'Google OAuth callback',
        description: 'OAuth provider callback endpoint. It is invoked by Google after authorization.',
        responses: { 201: response('Signed in with Google.') },
      },
    },
    '/book': {
      get: {
        tags: ['Books'],
        summary: 'Get all books',
        parameters: pagination,
        responses: { 200: response('Books loaded.'), 500: errorResponse('Could not load books.') },
      },
    },
    '/book/detail/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Get book detail',
        parameters: [bookId],
        responses: {
          200: response('Book loaded.'),
          404: errorResponse('Book not found.'),
          500: errorResponse('Could not load book.'),
        },
      },
    },
    '/book/mainpage': {
      get: {
        tags: ['Books'],
        summary: 'Get main page books',
        responses: { 200: response('Main page books loaded.'), 500: errorResponse('Could not load main page.') },
      },
    },
    '/book/mainpage/bestseller': {
      get: {
        tags: ['Books'],
        summary: 'Get bestseller books for a category',
        parameters: [queryParameter('categoryId', 'Category ID.', { type: 'string' }, true), ...pagination],
        responses: {
          200: response('Bestseller books loaded.'),
          500: errorResponse('Could not load bestseller books.'),
        },
      },
    },
    '/book/{groupName}': {
      get: {
        tags: ['Books'],
        summary: 'Get books by group',
        parameters: [pathParameter('groupName', 'Book group, such as Bestseller or ItemNewAll.'), ...pagination],
        responses: {
          200: response('Books loaded.'),
          400: errorResponse('Invalid book group.'),
          500: errorResponse('Could not load books.'),
        },
      },
    },
    '/book/search/isbn/{isbn}': {
      get: {
        tags: ['Books'],
        summary: 'Find a book by ISBN',
        parameters: [pathParameter('isbn', 'ISBN of the book.')],
        responses: {
          200: response('Book loaded.'),
          404: errorResponse('Book not found.'),
          500: errorResponse('Could not load book.'),
        },
      },
    },
    '/book/search/author': {
      get: {
        tags: ['Books'],
        summary: 'Find books by author',
        parameters: [
          queryParameter('author', 'Author name.', { type: 'string' }, true),
          queryParameter('bookId', 'Optional book ID used for pagination.', { type: 'integer' }),
          ...pagination,
        ],
        responses: { 200: response('Books loaded.'), 500: errorResponse('Could not load books.') },
      },
    },
    '/book/category/{categoryId}': {
      get: {
        tags: ['Books'],
        summary: 'Get books by category',
        parameters: [categoryId, ...pagination],
        responses: { 200: response('Books loaded.'), 500: errorResponse('Could not load books.') },
      },
    },
    '/category': {
      get: {
        tags: ['Categories'],
        summary: 'Get categories',
        parameters: [queryParameter('level', 'Optional category depth.', { type: 'integer' })],
        responses: { 200: response('Categories loaded.'), 500: errorResponse('Could not load categories.') },
      },
    },
    '/category/categoriesMap/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category map',
        parameters: [pathParameter('id', 'Category ID.')],
        responses: { 200: response('Category map loaded.'), 500: errorResponse('Could not load category map.') },
      },
    },
    '/category/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get a category',
        parameters: [pathParameter('id', 'Category ID.')],
        responses: {
          200: response('Category loaded.'),
          404: errorResponse('Category not found.'),
          500: errorResponse('Could not load category.'),
        },
      },
    },
    '/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get cart items',
        description: sessionNote,
        responses: {
          200: response('Cart loaded.'),
          400: errorResponse('User not found.'),
          500: errorResponse('Could not load cart.'),
        },
      },
      post: {
        tags: ['Cart'],
        summary: 'Add items to cart',
        description: sessionNote,
        requestBody: requestBody({
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['bookId', 'quantity'],
            properties: {
              bookId: { type: 'integer', example: 12 },
              quantity: { type: 'integer', minimum: 1, example: 2 },
            },
          },
        }),
        responses: {
          200: response('Items added.'),
          400: errorResponse('User not found.'),
          500: errorResponse('Could not add items.'),
        },
      },
    },
    '/cart/{id}': {
      put: {
        tags: ['Cart'],
        summary: 'Update cart item quantity',
        description: sessionNote,
        parameters: [bookId],
        requestBody: requestBody({
          type: 'object',
          required: ['quantity'],
          properties: { quantity: { type: 'integer', minimum: 1, example: 2 } },
        }),
        responses: {
          200: response('Cart item updated.'),
          400: errorResponse('User not found.'),
          500: errorResponse('Could not update cart.'),
        },
      },
      delete: {
        tags: ['Cart'],
        summary: 'Remove cart item',
        description: sessionNote,
        parameters: [bookId],
        responses: {
          200: response('Cart item removed.'),
          400: errorResponse('User not found.'),
          500: errorResponse('Could not remove cart item.'),
        },
      },
    },
    '/wishlist': {
      get: {
        tags: ['Wishlist'],
        summary: 'Get wishlist',
        description: sessionNote,
        parameters: pagination,
        responses: { 201: response('Wishlist loaded.'), 500: errorResponse('Could not load wishlist.') },
      },
      post: {
        tags: ['Wishlist'],
        summary: 'Add a wishlist item',
        description: sessionNote,
        requestBody: requestBody({
          type: 'object',
          required: ['bookId'],
          properties: { bookId: { type: 'integer', example: 12 } },
        }),
        responses: { 201: response('Wishlist item added.'), 500: errorResponse('Could not add wishlist item.') },
      },
      delete: {
        tags: ['Wishlist'],
        summary: 'Remove wishlist items',
        description: sessionNote,
        requestBody: requestBody({
          type: 'object',
          required: ['bookIds'],
          properties: { bookIds: { type: 'array', items: { type: 'integer' }, example: [12, 13] } },
        }),
        responses: { 201: response('Wishlist items removed.'), 500: errorResponse('Could not remove wishlist items.') },
      },
    },
    '/wishlist/toggle': {
      post: {
        tags: ['Wishlist'],
        summary: 'Toggle wishlist items',
        description: sessionNote,
        requestBody: requestBody({
          type: 'object',
          required: ['bookId'],
          properties: { bookId: { type: 'array', minItems: 1, items: { type: 'integer' }, example: [12] } },
        }),
        responses: {
          201: response('Wishlist updated.'),
          400: errorResponse('bookId must be a non-empty array.'),
          500: errorResponse('Could not update wishlist.'),
        },
      },
    },
    '/review/{bookId}': {
      get: {
        tags: ['Reviews'],
        summary: 'Get reviews for a book',
        parameters: [pathParameter('bookId', 'Book ID.')],
        responses: { 200: response('Reviews loaded.'), 500: errorResponse('Could not load reviews.') },
      },
      post: {
        tags: ['Reviews'],
        summary: 'Create a review',
        description: sessionNote,
        parameters: [pathParameter('bookId', 'Book ID.')],
        requestBody: requestBody({
          type: 'object',
          required: ['content'],
          properties: { content: { type: 'string', example: 'Great book.' } },
        }),
        responses: {
          200: response('Review created.'),
          400: errorResponse('User not found.'),
          500: errorResponse('Could not create review.'),
        },
      },
    },
    '/review/{bookId}/{reviewId}': {
      put: {
        tags: ['Reviews'],
        summary: 'Update a review',
        description: sessionNote,
        parameters: [pathParameter('bookId', 'Book ID.'), pathParameter('reviewId', 'Review ID.')],
        requestBody: requestBody({
          type: 'object',
          required: ['content'],
          properties: { content: { type: 'string', example: 'Updated review.' } },
        }),
        responses: {
          200: response('Review updated.'),
          400: errorResponse('User not found.'),
          500: errorResponse('Could not update review.'),
        },
      },
      delete: {
        tags: ['Reviews'],
        summary: 'Delete a review',
        description: sessionNote,
        parameters: [pathParameter('bookId', 'Book ID.'), pathParameter('reviewId', 'Review ID.')],
        responses: {
          200: response('Review deleted.'),
          400: errorResponse('User not found.'),
          500: errorResponse('Could not delete review.'),
        },
      },
    },
    '/order': {
      post: {
        tags: ['Orders'],
        summary: 'Create an order',
        description: sessionNote,
        requestBody: requestBody({
          type: 'object',
          required: ['shipInfo', 'orderedItems', 'totalPrice'],
          properties: {
            shipInfo: { type: 'object', description: 'Shipping information.' },
            orderedItems: { type: 'array', minItems: 1, items: { type: 'object' }, description: 'Items to order.' },
            totalPrice: { type: 'number', example: 24300 },
          },
        }),
        responses: {
          200: response('Order created.'),
          400: errorResponse('User not found.'),
          500: errorResponse('Could not create order.'),
        },
      },
    },
    '/order/history': {
      get: {
        tags: ['Orders'],
        summary: 'Get order history',
        description: sessionNote,
        responses: {
          200: response('Order history loaded.'),
          400: errorResponse('User not found.'),
          500: errorResponse('Could not load order history.'),
        },
      },
    },
  },
};

export default openapi;
