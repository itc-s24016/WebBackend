import passport from 'passport'
import {Strategy as localStrategy} from 'passport-local'
import argon2 from 'argon2'
import prisma from './db.js'