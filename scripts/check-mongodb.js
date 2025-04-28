// Script để kiểm tra kết nối với MongoDB
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkMongoDBConnection() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    console.log('Đang kết nối đến MongoDB...');
    await client.connect();
    console.log('✅ Kết nối thành công đến MongoDB!');
    
    const dbName = uri.split('/').pop().split('?')[0];
    console.log(`Cơ sở dữ liệu: ${dbName}`);
    
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('Cơ sở dữ liệu chưa có collection nào.');
    } else {
      console.log('Các collection hiện có:');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    console.log('\nBạn có thể tiếp tục với việc tạo lại Prisma client:');
    console.log('npm run prisma:generate');
    console.log('npm run prisma:push');
    
  } catch (error) {
    console.error('❌ Lỗi kết nối đến MongoDB:', error);
    console.log('\nVui lòng kiểm tra:');
    console.log('1. MongoDB đã được cài đặt và đang chạy');
    console.log('2. Chuỗi kết nối trong file .env là chính xác');
    console.log('3. Không có tường lửa chặn kết nối');
  } finally {
    await client.close();
  }
}

checkMongoDBConnection().catch(console.error);
