# Viet Heritage Hub API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Users
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

### Historical Timeline
- `GET /history` - Get all historical periods
- `GET /history/:id` - Get historical period by ID
- `POST /history` - Create new historical period (Admin only)
- `PUT /history/:id` - Update historical period (Admin only)
- `DELETE /history/:id` - Delete historical period (Admin only)

### Heritage Sites (Map)
- `GET /sites` - Get all heritage sites
- `GET /sites/:id` - Get site by ID
- `GET /sites/region/:region` - Get sites by region
- `POST /sites` - Create new site (Admin/Artisan)
- `PUT /sites/:id` - Update site
- `DELETE /sites/:id` - Delete site (Admin only)

### AI Features
- `POST /ai/calligraphy` - Generate calligraphy
- `POST /ai/restore-image` - Restore historical image
- `POST /ai/text-to-speech` - Convert text to speech
- `GET /ai/history/:userId` - Get user's AI usage history

### Products (Shop)
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/artisan/:artisanId` - Get products by artisan
- `POST /products` - Create new product (Artisan)
- `PUT /products/:id` - Update product (Artisan)
- `DELETE /products/:id` - Delete product (Artisan/Admin)

### Orders
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id/status` - Update order status (Artisan/Admin)

### Community
#### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

#### Groups
- `GET /groups` - Get all groups
- `GET /groups/:id` - Get group by ID
- `POST /groups` - Create new group
- `PUT /groups/:id` - Update group
- `DELETE /groups/:id` - Delete group

#### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `GET /events/upcoming` - Get upcoming events
- `POST /events` - Create new event (Artisan)
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

## Response Format
All responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

## Error Responses
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Rate Limiting
- Free users: 100 requests per hour
- Premium users: 1000 requests per hour
- AI features have separate limits

## File Uploads
For image uploads, use multipart/form-data with the field name 'image'. Supported formats: JPG, PNG, GIF. Max size: 5MB.
