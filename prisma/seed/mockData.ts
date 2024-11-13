import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const splitSql = (sql: string) => {
  return sql.split(';').filter(content => content.trim() !== '')
}

async function main() {
  const sql = `

INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('a67bd469-2958-43bf-9442-31716ea4e849', '1Everett.Rice9@hotmail.com', 'David Wilson', 'https://i.imgur.com/YfJQV5z.png?id=3', 'abc123token', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('16b72526-8ccf-47f2-8836-6b03f32a7416', '10Leonora_Kutch28@gmail.com', 'Jane Smith', 'https://i.imgur.com/YfJQV5z.png?id=12', 'abc123token', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('abb48a6b-cc93-4e75-831d-e6ebf8b6ea92', '19Joyce85@hotmail.com', 'Jane Smith', 'https://i.imgur.com/YfJQV5z.png?id=21', 'abc123token', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('2151ef93-d10f-464c-8822-9c18e0cd7b74', '28Chasity.Jast29@hotmail.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=30', 'abc123token', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('59250995-40fb-41e6-a28d-0b9c87f7621d', '37Gladyce.Schultz29@yahoo.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=39', 'mno345token', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('56f217ba-ae3f-4e4c-b528-02fc09930abd', '55Lee64@gmail.com', 'David Wilson', 'https://i.imgur.com/YfJQV5z.png?id=57', 'abc123token', false, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('f8c8647b-70de-4e2d-af8f-44aaeddcdb61', '64Arvid19@hotmail.com', 'David Wilson', 'https://i.imgur.com/YfJQV5z.png?id=66', 'jkl012token', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('c6a89361-dbf9-47de-b4f8-9a92cb2f1dcd', '73Drew.Leannon@yahoo.com', 'Emily Jones', 'https://i.imgur.com/YfJQV5z.png?id=75', 'abc123token', false, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('4a4a71b0-be65-4d11-ab65-ebf5b894940b', '82Wade52@hotmail.com', 'David Wilson', 'https://i.imgur.com/YfJQV5z.png?id=84', 'ghi789token', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');

INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('37db719f-2700-4bcb-b698-e237fc0b7ba1', 'httpsexample.comendpoint5', 'subscription_data_2', 'f8c8647b-70de-4e2d-af8f-44aaeddcdb61');
INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('f76e910d-e14c-4d40-9af0-26e637bc58b8', 'httpsexample.comendpoint2', 'subscription_data_2', 'abb48a6b-cc93-4e75-831d-e6ebf8b6ea92');
INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('acda7f27-d8f1-4cae-8025-4760cd895e3f', 'httpsexample.comendpoint4', 'subscription_data_5', '4a4a71b0-be65-4d11-ab65-ebf5b894940b');
INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('77425ea1-a4a3-4ceb-93a4-3a80263c9bef', 'httpsexample.comendpoint5', 'subscription_data_4', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');
INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('8fd2420f-2e03-4fcd-9870-1f6fa8176b8a', 'httpsexample.comendpoint2', 'subscription_data_1', '4a4a71b0-be65-4d11-ab65-ebf5b894940b');
INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('d6e2e137-54cb-4659-9410-3db7cf2680b6', 'httpsexample.comendpoint5', 'subscription_data_5', '59250995-40fb-41e6-a28d-0b9c87f7621d');
INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('265ec771-d328-47ff-b225-501d8c7af2f2', 'httpsexample.comendpoint1', 'subscription_data_2', '59250995-40fb-41e6-a28d-0b9c87f7621d');
INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('36eb9ce7-ae32-4d25-932a-e716215db1f2', 'httpsexample.comendpoint4', 'subscription_data_1', 'f8c8647b-70de-4e2d-af8f-44aaeddcdb61');
INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('9319545c-896a-4f77-8320-b6cd063186cf', 'httpsexample.comendpoint4', 'subscription_data_5', '59250995-40fb-41e6-a28d-0b9c87f7621d');
INSERT INTO "PushNotification" ("id", "endpoint", "subscription", "userId") VALUES ('c1a546ed-5302-415e-b100-1d4f855e1eef', 'httpsexample.comendpoint3', 'subscription_data_1', '56f217ba-ae3f-4e4c-b528-02fc09930abd');

INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('e0c86261-e13e-4cb2-b6c0-467afeab94aa', 'Laptop Stand', 'Highquality sound with noise cancellation.', '49.99', 498, 'Electronics', 'Available', false, 'https://i.imgur.com/YfJQV5z.png?id=128');
INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('db46efec-1a8c-4d3a-8c03-e32116c3e6ad', 'Bluetooth Speaker', 'Track your steps and monitor your heart rate.', '89.99', 607, 'Health', 'Available', false, 'https://i.imgur.com/YfJQV5z.png?id=137');
INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('f5d6e903-b883-4c7c-92df-beade19deea5', 'Bluetooth Speaker', 'Portable speaker with excellent bass.', '99.99', 720, 'Health', 'Available', false, 'https://i.imgur.com/YfJQV5z.png?id=146');
INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('dc78aade-7999-40cc-a2f2-ab680089ac70', 'Fitness Tracker', 'Portable speaker with excellent bass.', '99.99', 573, 'Office', 'Available', false, 'https://i.imgur.com/YfJQV5z.png?id=155');
INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('e2409d21-9ce6-447d-935e-6657dd573406', 'Bluetooth Speaker', 'Ergonomic design for better posture.', '29.99', 966, 'Audio', 'Available', false, 'https://i.imgur.com/YfJQV5z.png?id=164');
INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('c24dbdbb-e5be-489e-8f5d-5afe7fef643b', 'Wireless Earbuds', 'Ergonomic design for better posture.', '29.99', 37, 'Accessories', 'Out of Stock', true, 'https://i.imgur.com/YfJQV5z.png?id=173');
INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('a813aa56-6f0c-442d-84b9-0e5999979059', 'Smartphone Case', 'Ergonomic design for better posture.', '29.99', 960, 'Electronics', 'Available', true, 'https://i.imgur.com/YfJQV5z.png?id=182');
INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('3cd21916-0c86-4719-8452-ad57858ece2f', 'Fitness Tracker', 'Durable and stylish case for your smartphone.', '49.99', 656, 'Health', 'Available', false, 'https://i.imgur.com/YfJQV5z.png?id=191');
INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('5d0bc632-24c5-407e-b54c-77e2da0ced0d', 'Bluetooth Speaker', 'Highquality sound with noise cancellation.', '49.99', 149, 'Electronics', 'Available', false, 'https://i.imgur.com/YfJQV5z.png?id=200');
INSERT INTO "Product" ("id", "name", "description", "price", "stock", "category", "status", "featured", "imageUrl") VALUES ('28cdb5e1-3b42-4972-93a0-1887d2efee61', 'Smartphone Case', 'Ergonomic design for better posture.', '29.99', 459, 'Accessories', 'Available', false, 'https://i.imgur.com/YfJQV5z.png?id=209');

INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('e737535c-d814-4a1d-ab12-ebcefe74ea12', 'Flavor', 'Vanilla', 958, '5d0bc632-24c5-407e-b54c-77e2da0ced0d');
INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('bb8b5372-af68-4111-a637-217132f56a3c', 'Style', 'Red', 776, 'e0c86261-e13e-4cb2-b6c0-467afeab94aa');
INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('9aa29622-921c-4bdf-8d41-e0f46a7cc43c', 'Material', 'Red', 192, '5d0bc632-24c5-407e-b54c-77e2da0ced0d');
INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('df5e77b5-c875-4baa-aef1-d6e50e144b22', 'Material', 'Large', 768, 'db46efec-1a8c-4d3a-8c03-e32116c3e6ad');
INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('fe14dbb1-0b96-497f-bfb6-032ba979a740', 'Style', 'Casual', 826, 'c24dbdbb-e5be-489e-8f5d-5afe7fef643b');
INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('749fad24-7cbf-412c-9f68-a5239e198a1e', 'Size', 'Cotton', 4, '3cd21916-0c86-4719-8452-ad57858ece2f');
INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('3de9d4c7-41fa-42a8-9955-67714b6fb764', 'Color', 'Red', 206, 'e0c86261-e13e-4cb2-b6c0-467afeab94aa');
INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('8eef0475-a719-4653-af93-dddb5ef15909', 'Material', 'Casual', 877, '3cd21916-0c86-4719-8452-ad57858ece2f');
INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('144e4bea-59c7-4a55-b2cc-919043230376', 'Style', 'Vanilla', 215, 'a813aa56-6f0c-442d-84b9-0e5999979059');
INSERT INTO "Variant" ("id", "type", "value", "stock", "productId") VALUES ('81c4ac36-65fe-4c38-be16-b71d6bc3fe4e', 'Flavor', 'Large', 877, '28cdb5e1-3b42-4972-93a0-1887d2efee61');

INSERT INTO "Cart" ("id", "status", "userId") VALUES ('027b71ed-b0bb-45c7-8bf7-b5da8166b232', 'failed', '16b72526-8ccf-47f2-8836-6b03f32a7416');
INSERT INTO "Cart" ("id", "status", "userId") VALUES ('9732e7b7-1fd5-47a5-bfc2-aa78046c64d9', 'canceled', '56f217ba-ae3f-4e4c-b528-02fc09930abd');
INSERT INTO "Cart" ("id", "status", "userId") VALUES ('84f0c3a6-b064-4628-8511-99c389ecf234', 'failed', 'abb48a6b-cc93-4e75-831d-e6ebf8b6ea92');
INSERT INTO "Cart" ("id", "status", "userId") VALUES ('1ad769e8-14ab-4adf-9f89-e8360b7fc804', 'failed', '56f217ba-ae3f-4e4c-b528-02fc09930abd');
INSERT INTO "Cart" ("id", "status", "userId") VALUES ('dd0e4e2d-9e1c-482e-9133-9a42ea36b44c', 'failed', '16b72526-8ccf-47f2-8836-6b03f32a7416');
INSERT INTO "Cart" ("id", "status", "userId") VALUES ('a6bf94b5-86d6-45da-a595-13f9eb98398d', 'processing', '2151ef93-d10f-464c-8822-9c18e0cd7b74');
INSERT INTO "Cart" ("id", "status", "userId") VALUES ('00ae013a-0b1e-4272-897e-1b6fe5fc636b', 'completed', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');
INSERT INTO "Cart" ("id", "status", "userId") VALUES ('e16b2699-9aa2-4d95-8bbf-d386127e9057', 'canceled', '59250995-40fb-41e6-a28d-0b9c87f7621d');
INSERT INTO "Cart" ("id", "status", "userId") VALUES ('0b15355c-b30d-4fc0-9d20-2b8669f31285', 'canceled', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');
INSERT INTO "Cart" ("id", "status", "userId") VALUES ('a8a57482-7897-45ac-a160-ae6287c17bcc', 'pending', '56f217ba-ae3f-4e4c-b528-02fc09930abd');

INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('22619329-4e80-46ed-9e6d-2a889b01eddc', 625, '15.49', 'dd0e4e2d-9e1c-482e-9133-9a42ea36b44c', 'dc78aade-7999-40cc-a2f2-ab680089ac70', '9aa29622-921c-4bdf-8d41-e0f46a7cc43c');
INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('d5c9301c-a362-4fcd-b150-c1c8871145fd', 650, '19.99', '9732e7b7-1fd5-47a5-bfc2-aa78046c64d9', 'f5d6e903-b883-4c7c-92df-beade19deea5', 'fe14dbb1-0b96-497f-bfb6-032ba979a740');
INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('23d5d72e-992b-4459-b05a-a1fabf831398', 770, '29.99', 'dd0e4e2d-9e1c-482e-9133-9a42ea36b44c', 'e2409d21-9ce6-447d-935e-6657dd573406', '8eef0475-a719-4653-af93-dddb5ef15909');
INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('b1883cb7-a0ce-4666-b0b5-39bf7636f109', 833, '19.99', '027b71ed-b0bb-45c7-8bf7-b5da8166b232', 'db46efec-1a8c-4d3a-8c03-e32116c3e6ad', '749fad24-7cbf-412c-9f68-a5239e198a1e');
INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('7400108c-986d-44ee-b280-ff490d88159b', 557, '9.99', 'a8a57482-7897-45ac-a160-ae6287c17bcc', '28cdb5e1-3b42-4972-93a0-1887d2efee61', '749fad24-7cbf-412c-9f68-a5239e198a1e');
INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('ebbb9092-5a0f-458e-aee1-777c79490521', 856, '9.99', '84f0c3a6-b064-4628-8511-99c389ecf234', 'c24dbdbb-e5be-489e-8f5d-5afe7fef643b', '749fad24-7cbf-412c-9f68-a5239e198a1e');
INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('9dd569c4-c5a2-48bf-a054-ca5dffdb4653', 217, '25.00', '1ad769e8-14ab-4adf-9f89-e8360b7fc804', 'f5d6e903-b883-4c7c-92df-beade19deea5', '749fad24-7cbf-412c-9f68-a5239e198a1e');
INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('92f1ae10-8e43-4a9d-9c34-078955ae0e81', 217, '9.99', '027b71ed-b0bb-45c7-8bf7-b5da8166b232', 'a813aa56-6f0c-442d-84b9-0e5999979059', '8eef0475-a719-4653-af93-dddb5ef15909');
INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('c646a8cf-b4c6-468c-aae1-6bb8a32db45d', 39, '25.00', 'e16b2699-9aa2-4d95-8bbf-d386127e9057', '5d0bc632-24c5-407e-b54c-77e2da0ced0d', '749fad24-7cbf-412c-9f68-a5239e198a1e');
INSERT INTO "CartItem" ("id", "quantity", "price", "cartId", "productId", "variantId") VALUES ('55297f9d-45d6-474d-821d-cdd75d748191', 982, '29.99', '0b15355c-b30d-4fc0-9d20-2b8669f31285', 'dc78aade-7999-40cc-a2f2-ab680089ac70', 'fe14dbb1-0b96-497f-bfb6-032ba979a740');

INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('994bae0c-8711-45ad-b12d-4a5d827a052b', 'Delivered', '299.99', '303 42 E 20th St, New York, NY 10003', 'Apple Pay', 'c6a89361-dbf9-47de-b4f8-9a92cb2f1dcd');
INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('02cac916-601e-4f76-b2c2-63ab8643b4c5', 'Processing', '49.99', '308 430 Lafayette St, New York, NY 10003', 'PayPal', 'f8c8647b-70de-4e2d-af8f-44aaeddcdb61');
INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('c5c127cb-9674-43b6-8512-c0b21581a8e6', 'Cancelled', '150.00', '313 443 E 6th St, New York, NY 10009', 'Bank Transfer', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');
INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('565539b2-80d4-4670-bed9-28746e4b0412', 'Pending', '150.00', '318 443 E 6th St, New York, NY 10009', 'Bank Transfer', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');
INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('0b88ef2a-e837-43fc-b587-212e4f98254a', 'Shipped', '75.50', '323 136 E 13th St, New York, NY 10003', 'Apple Pay', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');
INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('b1197e19-73c0-4594-ae7a-1ac24b7dd97b', 'Processing', '150.00', '328 91 Christopher St, New York, NY 10014', 'Bank Transfer', '4a4a71b0-be65-4d11-ab65-ebf5b894940b');
INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('74bd6ddb-d4d3-4748-828a-b970b1b1d04d', 'Delivered', '120.25', '333 430 Lafayette St, New York, NY 10003', 'Credit Card', '2151ef93-d10f-464c-8822-9c18e0cd7b74');
INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('8569edf7-c6d9-49d8-8d6b-ec6ae869cc62', 'Delivered', '299.99', '338 330 W Broadway, New York, NY 10013', 'Google Pay', 'f8c8647b-70de-4e2d-af8f-44aaeddcdb61');
INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('f8eb18a6-c58f-43ae-bb79-56ee0849ecc2', 'Processing', '120.25', '343 91 Christopher St, New York, NY 10014', 'Google Pay', 'abb48a6b-cc93-4e75-831d-e6ebf8b6ea92');
INSERT INTO "Order" ("id", "status", "total", "shippingAddress", "paymentMethod", "userId") VALUES ('27363716-f0e2-4c54-af91-ba9bc2c5834d', 'Delivered', '150.00', '348 42 E 20th St, New York, NY 10003', 'Credit Card', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');

INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('e6313423-d33e-4f28-9b6d-c5f83750d064', 71, '45.00', '27363716-f0e2-4c54-af91-ba9bc2c5834d', '5d0bc632-24c5-407e-b54c-77e2da0ced0d', 'fe14dbb1-0b96-497f-bfb6-032ba979a740');
INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('be57ae3a-2038-475a-ba47-37b55c97fc35', 906, '30.75', '8569edf7-c6d9-49d8-8d6b-ec6ae869cc62', 'f5d6e903-b883-4c7c-92df-beade19deea5', 'fe14dbb1-0b96-497f-bfb6-032ba979a740');
INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('2bcd1725-a157-4986-922d-abc0b78ccaab', 924, '25.00', 'b1197e19-73c0-4594-ae7a-1ac24b7dd97b', '3cd21916-0c86-4719-8452-ad57858ece2f', 'bb8b5372-af68-4111-a637-217132f56a3c');
INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('29ef7e26-34c9-497f-b381-bf9423239d29', 42, '30.75', 'c5c127cb-9674-43b6-8512-c0b21581a8e6', 'c24dbdbb-e5be-489e-8f5d-5afe7fef643b', '3de9d4c7-41fa-42a8-9955-67714b6fb764');
INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('c6969473-50e2-44af-acae-2b4f878e7070', 301, '25.00', '8569edf7-c6d9-49d8-8d6b-ec6ae869cc62', 'f5d6e903-b883-4c7c-92df-beade19deea5', 'e737535c-d814-4a1d-ab12-ebcefe74ea12');
INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('2aceaee2-e7c6-4469-b463-8fbbb4cacffb', 501, '30.75', '8569edf7-c6d9-49d8-8d6b-ec6ae869cc62', 'dc78aade-7999-40cc-a2f2-ab680089ac70', '3de9d4c7-41fa-42a8-9955-67714b6fb764');
INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('82c80355-a195-4ad4-8ae5-db46b557cfa9', 317, '19.99', '565539b2-80d4-4670-bed9-28746e4b0412', 'e0c86261-e13e-4cb2-b6c0-467afeab94aa', '3de9d4c7-41fa-42a8-9955-67714b6fb764');
INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('f489b381-c8b4-4217-80fe-11fcb3b5d5c7', 795, '25.00', '27363716-f0e2-4c54-af91-ba9bc2c5834d', 'e2409d21-9ce6-447d-935e-6657dd573406', '144e4bea-59c7-4a55-b2cc-919043230376');
INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('98dbe59e-f730-43e4-ba8c-b5ebb037a945', 678, '12.50', '565539b2-80d4-4670-bed9-28746e4b0412', 'e0c86261-e13e-4cb2-b6c0-467afeab94aa', '81c4ac36-65fe-4c38-be16-b71d6bc3fe4e');
INSERT INTO "OrderItem" ("id", "quantity", "price", "orderId", "productId", "variantId") VALUES ('bd6b40c0-a419-4aa1-8343-0389249427f9', 595, '12.50', '8569edf7-c6d9-49d8-8d6b-ec6ae869cc62', '5d0bc632-24c5-407e-b54c-77e2da0ced0d', 'fe14dbb1-0b96-497f-bfb6-032ba979a740');

  `

  const sqls = splitSql(sql)

  for (const sql of sqls) {
    try {
      await prisma.$executeRawUnsafe(`${sql}`)
    } catch (error) {
      console.log(`Could not insert SQL: ${error.message}`)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
