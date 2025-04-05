import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 管理者ユーザーの作成
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理者ユーザー',
      password: adminPassword,
      role: 'admin',
      isActive: true,
    },
  })
  
  // 運転者ユーザーの作成
  const driverPassword = await hash('driver123', 10)
  const driver = await prisma.user.upsert({
    where: { email: 'driver@example.com' },
    update: {},
    create: {
      email: 'driver@example.com',
      name: '運転者ユーザー',
      password: driverPassword,
      role: 'driver',
      isActive: true,
    },
  })
  
  // 閲覧者ユーザーの作成
  const viewerPassword = await hash('viewer123', 10)
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: {
      email: 'viewer@example.com',
      name: '閲覧者ユーザー',
      password: viewerPassword,
      role: 'viewer',
      isActive: true,
    },
  })
  
  console.log({ admin, driver, viewer })
  
  // サンプル車両の作成
  const vehicle1 = await prisma.vehicle.upsert({
    where: { number: '品川500 あ 1234' },
    update: {},
    create: {
      number: '品川500 あ 1234',
      model: 'ハイエース',
      manufacturer: 'トヨタ',
      year: 2020,
      status: 'active',
      fuelType: 'diesel',
      capacity: 1000,
      mileage: 45678,
      inspectionDate: new Date('2023-10-15'),
      nextInspectionDate: new Date('2025-10-15'),
      insuranceExpiry: new Date('2024-05-20'),
      assignedDriverId: driver.id,
      notes: '社用車1号車',
    },
  })
  
  const vehicle2 = await prisma.vehicle.upsert({
    where: { number: '品川300 い 5678' },
    update: {},
    create: {
      number: '品川300 い 5678',
      model: 'NV350キャラバン',
      manufacturer: '日産',
      year: 2019,
      status: 'maintenance',
      fuelType: 'diesel',
      capacity: 1200,
      mileage: 78912,
      inspectionDate: new Date('2023-05-10'),
      nextInspectionDate: new Date('2025-05-10'),
      insuranceExpiry: new Date('2024-06-15'),
      notes: '社用車2号車',
    },
  })
  
  console.log({ vehicle1, vehicle2 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
