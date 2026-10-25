# Airbnb Clone (Zaio Full Stack Developer Boot Camp Capstone)

An Airbnb look-alike built from the Figma designs. It has a public site where people browse and reserve stays, an admin area where a logged in host manages listings, and a Node.js API behind both.

## Tech used

- Frontend: React (Vite), react-router-dom, axios, react-datepicker
- Backend: Node.js, Express, MongoDB Atlas with Mongoose
- Login: JWT and bcryptjs
- Images: Cloudinary (uploaded straight from the admin page)

## Features

- Home page with hero banner, location search, inspiration cards, experiences and footer
- Locations page that lists stays and filters by location
- Listing details page with photo gallery, amenities, reviews, a date picker and a live cost calculator
- Sign up, login and logout
- Reserve a stay, view your own reservations and delete them
- Admin page to create, view, edit and delete your listings, with image upload

## Folder structure

```
airbnb-backend/
  config/db.js                     database connection
  controllers/                     accommodation and reservation logic
  middleware/auth.js               checks the JWT token
  models/                          Accommodation, Reservation, User
  routes/                          auth, accommodation and reservation routes
  seed.js                          adds the 6 sample listings
  server.js                        starts the Express app
client/
  src/components/                  header, footer, search bar and home sections
  src/pages/                       locations page and view reservations
  src/views/                       admin dashboard, listing details, login
  src/api.js                       axios helper that adds the token to requests
```

## Setup

1. Clone the project and open the folder.

2. Backend
   - Go into the backend folder: `cd airbnb-backend`
   - Install packages: `npm install`
   - Copy `.env.example` to a new file called `.env` and fill in the values (see the table below)
   - Start the server: `node server.js`
   - The API runs on `http://localhost:5000`

3. Add the sample listings
   - Sign up on the site first so your user exists
   - In `airbnb-backend` run: `node seed.js your-email@example.com`
   - This deletes all listings and adds 6 samples owned by that user

4. Client
   - Go into the client folder: `cd client`
   - Install packages: `npm install`
   - Copy `.env.example` to a new file called `.env`
   - Start the site: `npm run dev`
   - The site runs on `http://localhost:5173`

## Environment variables

Backend (`airbnb-backend/.env`)

| Name | Required | What it is |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB Atlas connection string (`DATABASE_URL` also works) |
| `JWT_SECRET` | Yes | Secret used to sign tokens. The server stops if it is missing |
| `PORT` | No | Port for the server, 5000 by default |
| `CLIENT_URL` | No | The only website address allowed by CORS, `http://localhost:5173` by default |

Client (`client/.env`)

| Name | What it is |
| --- | --- |
| `VITE_API_URL` | Address of the API, for example `http://localhost:5000/api` |

## API endpoints

Base URL: `http://localhost:5000/api`. Routes marked "Token" need the header `Authorization: Bearer <token>`.

### Auth

| Method | URL | Token | Body | Responses |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | No | `name`, `email`, `password` | 201 with `token` and `user`. 400 for missing fields, a password under 6 characters or a bad email. 409 if the email is already used |
| POST | `/auth/login` | No | `email`, `password` | 200 with `token` and `user`. 400 for missing fields. 401 for wrong details |

### Accommodations

| Method | URL | Token | Description | Responses |
| --- | --- | --- | --- | --- |
| GET | `/accommodations` | No | All listings | 200 |
| GET | `/accommodations/:id` | No | One listing with the host's name | 200. 400 invalid id. 404 not found |
| POST | `/accommodations` | Yes | Create a listing. The host is the logged in user | 201. 400 validation error. 401 no token |
| PUT | `/accommodations/:id` | Yes | Update a listing (host only) | 200. 400 invalid id. 403 not the host. 404 not found |
| DELETE | `/accommodations/:id` | Yes | Delete a listing (host only) | 200. 400 invalid id. 403 not the host. 404 not found |

### Reservations

| Method | URL | Token | Description | Responses |
| --- | --- | --- | --- | --- |
| POST | `/reservations` | Yes | Create a reservation. Body: `accommodationId`, `checkInDate`, `checkOutDate`, `numberOfGuests`, `totalPrice`. The server fills `bookedBy`, `propertyName` and `totalNights` | 201. 400 bad id, dates, guests or price. 404 listing not found |
| GET | `/reservations` | Yes | Only the logged in user's reservations | 200 |
| PUT | `/reservations/:id` | Yes | Change dates, guests or price (own reservations only) | 200. 400. 404 |
| DELETE | `/reservations/:id` | Yes | Delete a reservation (own reservations only) | 200. 400 invalid id. 404 not found |

Any other URL returns 404 with `{ "message": "Route not found" }`.

## Testing

All endpoints were tested in Postman. The file `Airbnb-API.postman_collection.json` can be imported into Postman. It has a request for every endpoint, and the Login request saves the token for the others.

Error checks that were run:

- No token returns 401
- An invalid id returns 400
- An unknown route returns 404
- Updating or deleting another user's listing returns 403

## Notes

- In the admin form, add each amenity one at a time with the Add button.
- Images are uploaded from the browser to Cloudinary with an unsigned upload preset.
