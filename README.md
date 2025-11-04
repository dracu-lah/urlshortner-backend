# Url Shortner

## GET: /api/shortner?email=youremail@gmail.com

## POST: /api/shortner

```js
{
  "url": "https://www.yourwebsite.com",
  "email": "youremail@gmail.com",
  "customShortenedUrl": "custom-nevil" //Optional
}
```

## GET: /api/shortner/:shortenedUrl
