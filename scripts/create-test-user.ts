const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('test123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@agriconnect.ci' },
    update: {},
    create: {
      email: 'test@agriconnect.ci',
      password: hashedPassword,
      name: 'Test User',
      role: 'user'
    }
  })

  console.log('Created test user:', user)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
