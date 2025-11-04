# Url Shortner

## GET: /api/shortner?email=youremail@gmail.com

#### Lists all the shortned links of a user

## POST: /api/shortner

#### Create a new shortened url

```js
{
  "url": "https://www.yourwebsite.com",
  "email": "youremail@gmail.com",
  "customShortenedUrl": "custom-nevil" //Optional
}
```

## GET: /api/shortner/:shortenedUrl

#### Open the shortened the url
