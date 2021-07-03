import * as tweetRepository from '../data/tweet.data.js'

export async function getTweets(req, res) {
  const username = req.query.username
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll())
  res.send(data)
}

export async function createTweet(req, res) {
  const { text, name, username } = req.body
  if (!text || !name || !username) {
    res.sendStatus(400)
  }
  const tweet = {
    id: await tweetRepository.getUniqueId(),
    text,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    name,
    username,
    url: req.body.url,
  }
  await tweetRepository.create(tweet)
  res.status(201).send(tweet)
}

export async function getTweetById(req, res) {
  const id = Number(req.params.id)
  const tweet = await tweetRepository.getById(id)
  if (tweet) {
    res.send(tweet)
  } else {
    res.status(404).send({ message: `Tweet id(${id}) not found` })
  }
}

export async function updateTweet(req, res) {
  const id = Number(req.params.id)
  const tweet = await tweetRepository.update(id, req.body.text)
  if (tweet) {
    res.send(tweet)
  } else {
    res.status(404).send({ message: `Tweet id(${id}) not found` })
  }
}

export async function deleteTweet(req, res) {
  const id = Number(req.params.id)
  const result = await tweetRepository.remove(id)
  if (result) {
    res.sendStatus(204)
  } else {
    res.status(404).send({ message: `Tweet id(${id}) not found` })
  }
}