import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import * as userRepository from '../data/user.data.js'

export async function signup(req, res) {
  const body = req.body
  const username = body.username
  const found = await userRepository.findByUsername(username)
  if (found) {
    return res
      .status(409)
      .json({ message: `usename '${username}' already exists` })
  }
  const userInfo = {
    ...body,
    password: await bcrypt.hash(body.password, config.bcrypt.saltRounds),
  }
  const user = await userRepository.create(userInfo)
  const token = createJwt(user)
  res.status(201).send({ token, username: user.username })
}

export async function login(req, res) {
  const username = req.body.username
  const user = await userRepository.findByUsername(username)
  if (user == null) {
    res
      .status(401)
      .send({ message: `유효하지 않은 사용자 이름 또는 비밀번호입니다.` })
  }
  const result = await bcrypt.compare(req.body.password, user.password)
  if (result === false) {
    res.status(401).send('유효하지 않은 사용자 이름 또는 비밀번호입니다.')
  }
  const token = createJwt(user)
  res.status(200).send({ token, username: user.username })
}

function createJwt(user) {
  return jwt.sign({ sub: user.id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresIn,
  })
}

export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId)
  if (!user) {
    return res.status(404).json({ message: 'user not found' })
  }
  res.status(200).json({ token: req.token, username: user.username })
}
