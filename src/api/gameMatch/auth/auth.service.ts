import { getCollection } from '../../../services/db.service'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model'

interface RegisterUserInput {
  username: string
  email: string
  password: string
  bggUsername?: string
}

export async function registerUser({ username, email, password, bggUsername }: RegisterUserInput): Promise<User> {
  const userToInsert = {
    username,
    email,
    password,
    bggUsername: bggUsername || null,
    isGuest: false,
    createdAt: Date.now(),
  }

  const collection = await getCollection('user')
  const res = await collection.insertOne(userToInsert)

  return { ...userToInsert, _id: res.insertedId.toString() }
}

export async function createGuestUser(): Promise<User> {
  const collection = await getCollection('user')
  const userToInsert = {
    username: `guest_${Date.now()}`,
    isGuest: true,
    createdAt: Date.now(),
  }

  const res = await collection.insertOne(userToInsert)
  return { ...userToInsert, _id: res.insertedId.toString() }
}

export async function loginUser(email: string, password: string): Promise<User> {
  const collection = await getCollection('user')
  const user = await collection.findOne({ email, password })

  if (!user) throw new Error('Invalid credentials')

  return {
    ...user,
    _id: user._id.toString(),
  } as User
}
