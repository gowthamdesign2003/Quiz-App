# AI Quiz Application

##  Tech Stack

# Next.js 16 (node.js backend route as Next.js)
# TypeScript
# Prisma ORM
# PostgreSQL / pgAdmin
# OpenAI API
# Tailwind CSS




## .env 

//DATABASE_URL="file:./dev.db"
//OPENAI_API_KEY=sk-your-openai-api-key
//JWT_SECRET=""



##create jwt token in node cmd

#node
#require('crypto').randomBytes(64).toString('hex')



## Setup Prisma

# npx prisma generate
# npx prisma migrate dev --name init

## Optional – view database

# npx prisma studio

##run

# npm run dev
# http://localhost:3000

## rebuild

# rm -rf .next
# npm run dev
