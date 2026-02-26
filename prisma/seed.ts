import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.contentBlock.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.appeal.deleteMany();
  await prisma.successStory.deleteMany();
  await prisma.project.deleteMany();
  await prisma.event.deleteMany();
  await prisma.dog.deleteMany();
  await prisma.user.deleteMany();

  // ==========================================================================
  // Create Admin User
  // ==========================================================================
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@baanmaa.org';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Created admin user: ${admin.email}`);

  // ==========================================================================
  // Create Dogs
  // ==========================================================================
  const dogs = [
    {
      name: 'Ayr',
      slug: 'ayr',
      status: 'AVAILABLE' as const,
      age: 'Born January 2025',
      sex: 'FEMALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'A gentle, easygoing girl who loves walks, playtime, and being part of whatever is going on.',
      fullDescription: `Sweet and affectionate, Ayr loves to be close to her people. She is playful, gentle, and loyal, always keeping an eye on what you are doing and following along when she can. Ayr is the perfect blend of cuddly and independent. She enjoys company but is also content finding a comfy spot to relax and enjoy the breeze. Her playful curiosity often takes her on little side adventures during walks, and she can sometimes be found exploring rice fields or splashing in a canal.`,
      rescueStory: `Ayr was found as a pup on a construction site where she had been left with her 3 siblings. Thankfully, someone found them and took them out of harms way. She then grew up surrounded by care and kindness at Baan Maa. From the start, she showed a gentle and steady nature that makes her a joy to be around. She loves walks, playtime outside, and being part of whatever is going on. If you are heading somewhere, Ayr will be right behind you, happy just to be included.

On her walks, she enjoys little side quests, wandering through rice fields or taking a refreshing dip in the canal. Afterward, she is just as happy to find a cozy spot to rest and enjoy some peace. Ayr is social, friendly, and perfectly balanced between playful and calm. She would make a wonderful addition to any family looking for a loving, easygoing companion.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Gentle', 'Playful', 'Loyal', 'Easygoing']),
      featuredImage: '/images/dogs/ayr-profile.png',
      images: JSON.stringify(['/images/dogs/ayr.png', '/images/dogs/ayr-2.png', '/images/dogs/ayr-3.png', '/images/dogs/ayr-4.png', '/images/dogs/ayr-6.png', '/images/dogs/ayr-7.png', '/images/dogs/ayr-8.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Biao',
      slug: 'biao',
      status: 'AVAILABLE' as const,
      age: 'Born March 2025',
      sex: 'FEMALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'A joyful little bundle of love who greets every day with enthusiasm.',
      fullDescription: `Biao is a young, sweet-natured girl who is full of life and affection. She is playful, curious, and eager to explore her surroundings. She adores attention and loves being around people, kids, and other dogs. Her gentle, friendly nature makes her easy to bond with and an ideal first-time pet.`,
      rescueStory: `Biao's story began in April 2025 when she and her siblings were found dumped on the side of the road at just five weeks old. They were frightened, hungry, and in need of help. Once brought to safety, it took about a week for Biao to settle and start showing her true self. Since then, she has blossomed into a joyful little bundle of love who greets every day with enthusiasm.

She loves people, children, and dogs of all shapes and sizes. Her playful side shines when she is running around with her friends or discovering something new, but she also has a gentle, cuddly side that makes her a wonderful companion. Biao's resilience and loving personality make her a very special little dog who will bring warmth and happiness to any home lucky enough to have her.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: false,
      traits: JSON.stringify(['Playful', 'Curious', 'Affectionate', 'Sociable']),
      featuredImage: '/images/dogs/biao-profile.png',
      images: JSON.stringify(['/images/dogs/biao.png', '/images/dogs/biao-2.png', '/images/dogs/biao-3.png', '/images/dogs/biao-4.png', '/images/dogs/biao-5.png', '/images/dogs/biao-6.png', '/images/dogs/biao-7.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Care Bear',
      slug: 'care-bear',
      status: 'AVAILABLE' as const,
      age: 'Born November 2024',
      sex: 'MALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'An affectionate boy who oozes love from the moment he meets someone.',
      fullDescription: `Care Bear oozes love from the moment he meets someone. He is affectionate, confident, and loves both people and food in equal measure. Playful and sweet, he enjoys spending time with other dogs and is wonderful with children. He is the kind of dog who brightens every room and makes every day feel lighter.`,
      rescueStory: `Care Bear has been loved and cared for since he was a tiny pup, growing up surrounded by the Baan Maa family. From the beginning, his affectionate nature stood out. He walks right over to greet anyone new, hoping for a pat or a tasty treat. He is the unique pup of his litter, inheriting his mama's signature pointy ears and a touch of terrier charm with his fuzzy face. Care Bear is playful, curious, and quick to learn. He loves joining the other dogs for playtime and exploring the garden but is just as content relaxing beside you when the day winds down.

He has been thriving at Baan Maa, but it is clear he is ready for the next chapter. Care Bear deserves a home where he can be the star of the show, surrounded by people who will return the love he gives so freely. With his mix of affection, fun, and loyalty, he is sure to become a beloved member of any family.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Affectionate', 'Confident', 'Playful', 'Social']),
      featuredImage: '/images/dogs/care-bear-profile.jpg',
      images: JSON.stringify(['/images/dogs/care-bear.png', '/images/dogs/care-bear-2.png', '/images/dogs/care-bear-3.png', '/images/dogs/care-bear-4.png', '/images/dogs/care-bear-6.png', '/images/dogs/care-bear-8.png', '/images/dogs/care-bear-10.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Champ',
      slug: 'champ',
      status: 'AVAILABLE' as const,
      age: 'Born November 2022',
      sex: 'MALE' as const,
      size: 'LARGE' as const,
      breed: 'Thai mix breed',
      shortDescription: 'A big dog with an even bigger heart, resilient and full of love.',
      fullDescription: `Champ is a big dog with an even bigger heart. He is playful, affectionate, and gentle, with a kind nature that makes him easy to love. He enjoys being part of daily life and loves to show his affection with cuddles and soft kisses. Whether he is playing in the garden or lying quietly beside you, Champ's warm presence brings comfort and happiness.`,
      rescueStory: `Champ's journey is a story of strength and love. When he arrived at Baan Maa after his accident, he faced a long road to recovery. Despite the pain and challenges, his tail never stopped wagging. Through every physio session and vet visit, he showed the same gentle patience and kind heart that define him today.

He loves long walks, running through open fields, and splashing into ponds whenever he gets the chance. He starts each morning with a kiss for our toddler before joining him for a stroll, proving just how gentle and trustworthy he is. Active and joyful, yet calm and affectionate when the day winds down, Champ is a true all-rounder who brings balance, love, and laughter to every day.

His resilience, sweet nature, and infectious smile make him truly one of a kind. Champ is now ready for his next chapter \u2013 a home where he can share his big heart with a family who will love him just as much as he loves them.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Gentle', 'Resilient', 'Affectionate', 'Playful']),
      featuredImage: '/images/dogs/champ-profile.png',
      images: JSON.stringify(['/images/dogs/champ.png', '/images/dogs/champ-2.png', '/images/dogs/champ-3.png', '/images/dogs/champ-4.png', '/images/dogs/champ-5.png', '/images/dogs/champ-6.png', '/images/dogs/champ-7.png', '/images/dogs/champ-8.png', '/images/dogs/champ-9.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Coco',
      slug: 'coco',
      status: 'AVAILABLE' as const,
      age: 'Born 2021/22',
      sex: 'FEMALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Pitbull',
      shortDescription: 'A sweet, loving girl who simply wants to be someone\'s little companion.',
      fullDescription: `Coco is a very sweet and affectionate girl who simply wants to be someone's little companion. She loves curling up close, sunbathing in the garden, and joining her people for soft, comforting moments. Although she can be shy if she thinks she is in trouble, this comes from her past and not from her true nature. Once she understands she is safe, she is funny, playful, and eager to please. Coco blossoms with gentle voices and soft hands. She is loyal, loving, and happiest when she is by your side.`,
      rescueStory: `When Coco arrived she was skin and bone, every rib visible, weakened by blood parasites and with eyes so infected and cloudy we thought she was almost blind. Despite everything, she was gentle. Fearful but friendly. Desperate to please.

Within a few weeks of proper food and medication, her eyes cleared and her strength began to return. And with it, her beautiful personality. Coco loves people with her whole heart. When she sees someone coming, her entire body wags with happiness. She is your shadow, quietly following you around, just wanting to be near. She has been through so much, yet she looks at you with pure love.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: false,
      traits: JSON.stringify(['Sweet', 'Loyal', 'Affectionate', 'Gentle']),
      featuredImage: '/images/dogs/coco-profile.png',
      images: JSON.stringify(['/images/dogs/coco.png', '/images/dogs/coco-2.png', '/images/dogs/coco-3.png']),
      sponsorshipGoal: 30,
    },
    {
      name: 'Danny',
      slug: 'danny',
      status: 'AVAILABLE' as const,
      age: 'Born November 2024',
      sex: 'MALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'A social, confident young dog with a big personality and an even bigger heart.',
      fullDescription: `Danny is a social, confident young dog with a big personality and an even bigger heart. He has been raised with love and care, and has grown into a playful, affectionate companion who loves being part of the action. He is outgoing, curious, and full of fun, always ready to explore and share in family life.`,
      rescueStory: `Danny grew up surrounded by care and affection at Baan Maa, where his bright personality quickly began to shine. He loves exploring the world around him and enjoys being part of everything that is happening. When new people arrive in his space, he may bark to let them know he is there, but once they take a moment to greet him and let him investigate, he quickly relaxes and shows his friendly, playful side. He gets along wonderfully with other dogs, especially older ones who enjoy his playful energy. Danny loves going for walks through the neighbourhood, hikes in the hills, and even trips to the beach. He walks beautifully on a lead, and even the younger members of a family can handle him with ease. Danny thrives on companionship. He might fuss a little when left alone, but he quickly settles and waits patiently for his people to return. He is happiest when he can be part of everything, whether it is a family walk, a car ride, or just relaxing together at home. With his affectionate nature, intelligence, and zest for life, Danny would make a wonderful addition to any active home ready to welcome a loyal new family member.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Social', 'Confident', 'Playful', 'Affectionate']),
      featuredImage: '/images/dogs/danny-profile.png',
      images: JSON.stringify(['/images/dogs/danny.png', '/images/dogs/danny-2.png', '/images/dogs/danny-3.png', '/images/dogs/danny-4.png', '/images/dogs/danny-5.png', '/images/dogs/danny-6.png', '/images/dogs/danny-7.png', '/images/dogs/danny-8.png', '/images/dogs/danny-9.png', '/images/dogs/danny-11.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Del Boy',
      slug: 'del-boy',
      status: 'AVAILABLE' as const,
      age: 'Born 2021/22',
      sex: 'MALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'A confident, affectionate boy who absolutely loves human company.',
      fullDescription: `Del Boy is a confident, affectionate boy who absolutely loves human company. If you sit down, he is right beside you, resting his head on your lap and soaking up the attention. He has a playful side and enjoys mixing with the other dogs, often acting like one of the big boys in town despite his shorter legs.

He also has a sense of adventure. He loves going out on the bike and sidecar and will happily hop on and balance himself on the back while you ride. He thrives on being included and involved.

He has not been tested with cats and does have a higher prey drive, so careful introductions would be needed.`,
      rescueStory: `Del Boy was dumped in the forest in Hua Hin and found by a kind Thai lady who took him and the other dog he was with into her care. After a few months, they were moved to a crowded shelter filled with large dogs, where they struggled to get their share of food and water. A separate rescuer reached out and asked if we could help, and we brought both boys to safety.

When Del Boy arrived, he was in good physical condition but slightly reserved. He seemed more focused on people at first, sticking close for reassurance. Once he realised the other dogs meant no harm, he quickly relaxed, made friends, and settled in beautifully.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Confident', 'Affectionate', 'Adventurous', 'People-focused']),
      featuredImage: '/images/dogs/del-boy-profile.png',
      images: JSON.stringify(['/images/dogs/del-boy.png', '/images/dogs/del-boy-2.png', '/images/dogs/del-boy-3.png', '/images/dogs/del-boy-4.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Jeut',
      slug: 'jeut',
      status: 'AVAILABLE' as const,
      age: 'Born March 2025',
      sex: 'FEMALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'The perfect mix of silly, sweet, and self-assured.',
      fullDescription: `Jeut is the perfect mix of silly, sweet, and self-assured. She is playful, cuddly, and curious, yet confident enough to entertain herself and take little solo strolls to explore her surroundings. She has a cheerful spirit, a bright mind, and a heart full of love. Whether she is playing, napping, or observing the world around her, she radiates calm happiness.`,
      rescueStory: `Jeut joined Baan Maa as a young pup with a bright personality and an easygoing nature. From the start, she showed everyone how adaptable and friendly she is. She loves to play with her friends, chase toys, and be part of the fun, yet she is also perfectly happy relaxing on her own when things quiet down.

She is the kind of dog who makes life feel lighter. Whether she is curled up at your feet or trotting around the garden with her tail wagging, she brings calm energy and quiet joy to every day. Jeut would make a wonderful addition to any loving home that appreciates a dog who is both affectionate and independent.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Sweet', 'Playful', 'Curious', 'Independent']),
      featuredImage: '/images/dogs/jeut-profile.png',
      images: JSON.stringify(['/images/dogs/jeut.png', '/images/dogs/jeut-2.png', '/images/dogs/jeut-3.png', '/images/dogs/jeut-4.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Ka Nom',
      slug: 'ka-nom',
      status: 'AVAILABLE' as const,
      age: 'Born October 2024',
      sex: 'FEMALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'Loyal, affectionate, and eager to please \u2013 ready to blossom in the right home.',
      fullDescription: `Ka Nom is playful, affectionate, and enjoys spending time with people she trusts. She loves exploring, chasing toys, and relaxing in her crate when she wants a little quiet time. She has excellent recall and listens well, making her easy to include in daily activities.

She can be cautious around unfamiliar dogs, but once she feels comfortable, her friendly and joyful personality shines through. With the right support and calm introductions, Ka Nom will continue to grow into a confident and loving companion.`,
      rescueStory: `Ka Nom came to Baan Maa as a tiny pup with a bite wound near her eye. Thanks to quick treatment and a lot of love, she made a full recovery and has been winning hearts ever since.

She was adopted and spent four months in a home with three larger dogs, but often found herself caught in the middle of their disagreements. As a result, she can be a little nervous or guarded around unfamiliar dogs. With slow introductions and calm energy, especially on neutral ground, she learns to relax and make friends.

Ka Nom's favourite place to unwind is her crate or on a bed in the sun, where she enjoys her "me time" and feels safe. She is loyal, affectionate, and eager to please. With the right home, she will blossom into a devoted companion who loves deeply and brings warmth to everyone around her.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Loyal', 'Affectionate', 'Playful', 'Eager to please']),
      featuredImage: '/images/dogs/ka-nom-profile.png',
      images: JSON.stringify(['/images/dogs/ka-nom.png', '/images/dogs/ka-nom-2.png', '/images/dogs/ka-nom-3.png', '/images/dogs/ka-nom-4.png', '/images/dogs/ka-nom-5.png', '/images/dogs/ka-nom-6.png', '/images/dogs/ka-nom-7.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Khao Hom',
      slug: 'khao-hom',
      status: 'AVAILABLE' as const,
      age: 'Born May 2022',
      sex: 'MALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'A calm, loving three-legged champ who knows how to appreciate the little things.',
      fullDescription: `Gentle, affectionate, and resilient. Khao Hom has a naturally calm presence and a big heart for connection. He loves attention and affection but never demands it \u2014 he simply melts into your side and stays close. He is confident in familiar surroundings and quietly brave when facing new challenges.`,
      rescueStory: `If you're looking for a calm, loving, and truly special companion, Khao Hom is the one. This easy-going boy loves nothing more than lounging around, soaking up affection, and enjoying life's simple pleasures. Whether it's curling up beside you for cuddles or stretching out for a peaceful nap, Khao Hom knows how to appreciate the little things.

But don't let his relaxed nature fool you \u2014 this three-legged champ still enjoys playful moments and bursts of happy energy when he's with his favourite people! He gets along wonderfully with other dogs, is patient and kind with puppies and children, and thrives in a home where he can be part of the family.

We found him struggling in the rice fields with a severe leg infection. Despite every effort, his leg couldn't be saved \u2014 yet he never lost his spark. He's adapted beautifully and continues to thrive, winning hearts with his trusting, gentle nature. All he's looking for now is a warm, loving home where he can enjoy cuddles, good food, and a comfy bed. If you're ready to open your heart to this loyal and resilient sweetheart, Khao Hom is waiting for you.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Gentle', 'Calm', 'Resilient', 'Affectionate']),
      featuredImage: '/images/dogs/khao-hom-profile.png',
      images: JSON.stringify(['/images/dogs/khao-hom.png', '/images/dogs/khao-hom-2.png', '/images/dogs/khao-hom-3.png', '/images/dogs/khao-hom-4.png', '/images/dogs/khao-hom-5.png', '/images/dogs/khao-hom-6.png', '/images/dogs/khao-hom-7.png', '/images/dogs/khao-hom-8.png', '/images/dogs/khao-hom-9.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Paisley',
      slug: 'paisley',
      status: 'AVAILABLE' as const,
      age: 'Born January 2025',
      sex: 'FEMALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'A sweet, cuddly girl who loves being around her people and playing with friends.',
      fullDescription: `Sweet, cuddly, and always ready for playtime, Paisley is a gentle and affectionate girl who loves being around her people. She is great with children and especially fond of older, larger dogs. Her happy personality and wagging tail bring warmth to everyone she meets. While she can be a little possessive of food around smaller dogs, she is learning quickly and improving every day.`,
      rescueStory: `Paisley has grown up surrounded by love and care at Baan Maa. From the start, she stood out as a gentle, affectionate soul who loves to be close to people. Her favourite moments are spent cuddling, playing with her friends, and greeting everyone with her bright, expressive eyes.

She enjoys playtime with dogs of all sizes, though she has a special fondness for bigger friends who match her playful energy. Around food, she is still learning to share, but with guidance and structure, she has made great progress. Paisley's blend of sweetness, intelligence, and eagerness to please makes her a dream companion for anyone ready to give her a lifetime of love.

With her kind heart, gentle energy, and love for people, Paisley will make a wonderful addition to any home that wants a loyal, playful friend to share life's moments with.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Sweet', 'Cuddly', 'Playful', 'Affectionate']),
      featuredImage: '/images/dogs/paisley-profile.png',
      images: JSON.stringify(['/images/dogs/paisley.png', '/images/dogs/paisley-3.png', '/images/dogs/paisley-4.png', '/images/dogs/paisley-6.png', '/images/dogs/paisley-7.png', '/images/dogs/paisley-8.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Popcorn',
      slug: 'popcorn',
      status: 'AVAILABLE' as const,
      age: 'Born 2023/24',
      sex: 'FEMALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Pitbull',
      shortDescription: 'A high-energy pocket rocket who loves life, toys, and adventures.',
      fullDescription: `Popcorn is a high energy little pocket rocket who loves life. She is playful, enthusiastic, and full of spirit. She adores toys, enjoys chase games with her people, and loves exploring on walks.

With new people she may need a moment of encouragement before her confidence appears, but once she warms up she is sweet, friendly, and eager to connect. Her unique colouring and petite Pitbull frame make her truly unforgettable. She is bouncy, fun loving, and always ready for the next adventure.`,
      rescueStory: `Popcorn arrived at Baan Maa as a young dog bursting with energy and personality. She quickly became known for her cheerful outlook, her confident spirit, and her love of toys. She made friends easily, both canine and human, and always brought fun wherever she went.

Although she can be bouncy and jumpy when she is excited, she is eager to learn and thrives when given clear direction. Popcorn has enormous potential and would be a wonderful match for someone who enjoys an active lifestyle and a dog who is always ready to make the day brighter.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: false,
      traits: JSON.stringify(['Energetic', 'Playful', 'Spirited', 'Fun-loving']),
      featuredImage: '/images/dogs/popcorn-profile.png',
      images: JSON.stringify(['/images/dogs/popcorn.png', '/images/dogs/popcorn-2.png', '/images/dogs/popcorn-3.png']),
      sponsorshipGoal: 20,
    },
    {
      name: 'Rambo',
      slug: 'rambo',
      status: 'AVAILABLE' as const,
      age: 'Born 2021/22',
      sex: 'MALE' as const,
      size: 'LARGE' as const,
      breed: 'Pitbull',
      shortDescription: 'A giant teddy bear at heart who absolutely loves people and playing fetch.',
      fullDescription: `Rambo is a giant teddy bear at heart, who absolutely loves people. He has not met a person he did not like and he greets everyone with full body wiggles. He is affectionate, silly, and happiest when playing with toys. Balls are his favourite and he will play fetch for as long as someone is willing.

He is smart and eager to learn. His recall is very good and he enjoys long sniffing walks where he can explore. He thrives on kind leadership and clear direction.`,
      rescueStory: `Rambo grew up needing to protect himself which shaped some of his early reactions to other dogs. Despite this, he is a very sweet and loving boy who wants nothing more than a safe place, kind people, and a comfy bed to call his own.

Since arriving at Baan Maa he has made real progress. He now walks calmly with well balanced dogs and enjoys the company of gentle females. He loves training sessions, long walks, and his beloved ball games.

Rambo is a joyful and affectionate dog who wants to give his heart to the right family. With understanding and consistency he will become a loyal and loving companion.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: false,
      traits: JSON.stringify(['Affectionate', 'Playful', 'Smart', 'Loyal']),
      featuredImage: '/images/dogs/rambo-profile.png',
      images: JSON.stringify(['/images/dogs/rambo.png', '/images/dogs/rambo-2.png', '/images/dogs/rambo-3.png', '/images/dogs/rambo-4.png']),
      sponsorshipGoal: 30,
    },
    {
      name: 'Wan',
      slug: 'wan',
      status: 'AVAILABLE' as const,
      age: 'Born March 2025',
      sex: 'FEMALE' as const,
      size: 'MEDIUM' as const,
      breed: 'Thai mix breed',
      shortDescription: 'A sweet, easygoing girl with a natural gift for making friends.',
      fullDescription: `Wan is a sweet, easygoing girl with a natural gift for making friends. She is playful and curious but also calm and affectionate. She loves walks, enjoys playing in the garden, and is equally happy to relax nearby while you go about your day. Her calm confidence helps other dogs feel safe, and she has a special way of bringing out the best in everyone she meets.`,
      rescueStory: `Wan has been a favourite at Baan Maa for her kind spirit and gentle way with others. One of her proudest moments was helping a neglected Pitbull named Peach learn how to play again. With patience and affection, Wan showed her what friendship and trust look like, and the two became inseparable.

That same calm, loving energy is what makes Wan so special. She is always ready for a walk, a cuddle, or a quiet moment by your side. Her easygoing nature and warm heart make her a dog who fits right in wherever she goes.

Wan is now ready to find a family of her own \u2013 one that will give her the same love and loyalty she has given to everyone around her.`,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      houseTrained: true,
      traits: JSON.stringify(['Sweet', 'Calm', 'Friendly', 'Gentle']),
      featuredImage: '/images/dogs/wan-profile.png',
      images: JSON.stringify(['/images/dogs/wan.png', '/images/dogs/wan-2.png', '/images/dogs/wan-3.png', '/images/dogs/wan-4.png', '/images/dogs/wan-5.png', '/images/dogs/wan-6.png']),
      sponsorshipGoal: 20,
    },
  ];

  for (const dog of dogs) {
    await prisma.dog.create({ data: dog });
  }
  console.log(`✅ Created ${dogs.length} dogs`);

  // ==========================================================================
  // Create Events
  // ==========================================================================
  const events = [
    {
      title: 'Adoption Day at Central Tha Yang',
      slug: 'adoption-day-march-2026',
      description: 'Join us for our monthly adoption event! Meet our rescue dogs looking for forever homes. All dogs are vaccinated, spayed/neutered, and microchipped. Adoption counselors will be on hand to help you find your perfect match.',
      date: new Date('2026-03-15T10:00:00'),
      endDate: new Date('2026-03-15T16:00:00'),
      location: 'Central Tha Yang, Phetchaburi',
      isOnline: false,
      featuredImage: '/images/events/adoption-day.jpg',
      isPublished: true,
    },
    {
      title: 'Virtual Sanctuary Tour',
      slug: 'virtual-tour-march-2026',
      description: 'Cannot visit us in person? Join our live virtual tour of the sanctuary! Meet our dogs, see their daily routines, and learn about how we care for over 50 rescue dogs. Q&A session included.',
      date: new Date('2026-03-22T14:00:00'),
      endDate: new Date('2026-03-22T15:30:00'),
      location: 'Online via Zoom',
      isOnline: true,
      featuredImage: '/images/events/virtual-tour.jpg',
      isPublished: true,
    },
    {
      title: 'Fundraising Gala Dinner',
      slug: 'gala-dinner-april-2026',
      description: 'An evening of fine dining and fundraising for Baan Maa Dog Rescue. Enjoy a four-course Thai-Western fusion dinner, live entertainment, and a silent auction. All proceeds go directly to dog care and rescue operations.',
      date: new Date('2026-04-20T18:00:00'),
      endDate: new Date('2026-04-20T22:00:00'),
      location: 'Regent Cha-Am Beach Resort, Hua Hin',
      isOnline: false,
      featuredImage: '/images/events/gala-dinner.jpg',
      isPublished: true,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }
  console.log(`✅ Created ${events.length} events`);

  // ==========================================================================
  // Create Donation Projects
  // ==========================================================================
  const projects = [
    {
      title: 'Emergency Medical Fund',
      slug: 'emergency-medical-fund',
      description: 'Help us provide life-saving emergency medical care for dogs in critical condition. This fund covers emergency surgeries, intensive care, and urgent treatments that cannot wait.',
      goalAmount: 10000,
      raisedAmount: 4250,
      featuredImage: '/images/projects/medical-fund.jpg',
      isActive: true,
      isPriority: true,
    },
    {
      title: 'New Shelter Building',
      slug: 'new-shelter-building',
      description: 'We are expanding our sanctuary to accommodate more rescue dogs. Help us build a new climate-controlled shelter that will house 20 additional dogs in comfort.',
      goalAmount: 25000,
      raisedAmount: 12500,
      featuredImage: '/images/projects/new-shelter.jpg',
      isActive: true,
      isPriority: true,
    },
    {
      title: 'Monthly Food Program',
      slug: 'monthly-food-program',
      description: 'Feed our sanctuary dogs for a month! Your donation ensures all 50+ dogs receive nutritious food daily. Every meal matters.',
      goalAmount: 2000,
      raisedAmount: 1800,
      featuredImage: '/images/projects/food-program.jpg',
      isActive: true,
      isPriority: false,
    },
    {
      title: 'Spay & Neuter Campaign',
      slug: 'spay-neuter-campaign',
      description: 'Help us reduce the street dog population humanely. We provide free spay/neuter services to community dogs and offer education about responsible pet ownership.',
      goalAmount: 5000,
      raisedAmount: 2100,
      featuredImage: '/images/projects/spay-neuter.jpg',
      isActive: true,
      isPriority: false,
    },
    {
      title: 'International Adoption Transport',
      slug: 'international-adoption-transport',
      description: 'Help us cover the costs of flying rescued dogs to their forever homes abroad. Each flight costs approximately £500 and gives a dog a second chance at life.',
      goalAmount: 15000,
      raisedAmount: 8750,
      featuredImage: '/images/projects/adoption-transport.jpg',
      isActive: true,
      isPriority: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`✅ Created ${projects.length} projects`);

  // ==========================================================================
  // Create Success Stories
  // ==========================================================================
  const successStories = [
    {
      slug: 'champ-recovery',
      dogName: 'Champ',
      title: 'From Car Accident to Full Recovery',
      summary: 'Hit by a car and left with a dislocated femur, Champ underwent surgery and months of physiotherapy to make a full recovery.',
      content: `When Champ arrived at Baan Maa after being hit by a car, he faced a long road to recovery. His femur was dislocated and he was in tremendous pain. But even through the worst of it, his tail never stopped wagging.

Through every physio session and vet visit, he showed the same gentle patience and kind heart that define him today. Our team worked tirelessly to help him heal, and Champ never gave up.

Today, Champ runs, walks, and plays comfortably. He starts each morning with a kiss for our toddler before joining him for a stroll, proving just how gentle and trustworthy he is.

His resilience, sweet nature, and infectious smile make him truly one of a kind. Champ is now ready for his next chapter \u2013 a home where he can share his big heart with a family who will love him just as much as he loves them.`,
      beforeImage: '/images/dogs/champ.png',
      afterImage: '/images/dogs/champ-2.png',
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'coco-transformation',
      dogName: 'Coco',
      title: 'From Skin and Bone to Full of Love',
      summary: 'Coco arrived emaciated, riddled with parasites, and nearly blind. Today she is one of the most loving dogs at Baan Maa.',
      content: `When Coco arrived she was skin and bone, every rib visible, weakened by blood parasites and with eyes so infected and cloudy we thought she was almost blind. Despite everything, she was gentle. Fearful but friendly. Desperate to please.

Within a few weeks of proper food and medication, her eyes cleared and her strength began to return. And with it, her beautiful personality.

Coco loves people with her whole heart. When she sees someone coming, her entire body wags with happiness. She is your shadow, quietly following you around, just wanting to be near.

She has been through so much, yet she looks at you with pure love. Coco is now looking for a calm and loving home where she can be the centre of attention and enjoy the comfort she has missed for much of her life.`,
      beforeImage: '/images/dogs/coco.png',
      afterImage: '/images/dogs/coco-2.png',
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'khao-hom-three-legs',
      dogName: 'Khao Hom',
      title: 'Three Legs, One Big Heart',
      summary: 'Found struggling in the rice fields with a severe leg infection, Khao Hom lost a leg but never lost his spark.',
      content: `We found Khao Hom struggling in the rice fields with a severe leg infection. Despite every effort, his leg couldn't be saved. Yet he never lost his spark.

He adapted beautifully to life on three legs and continues to thrive, winning hearts with his trusting, gentle nature. This easy-going boy loves nothing more than lounging around, soaking up affection, and enjoying life's simple pleasures.

Don't let his relaxed nature fool you \u2014 this three-legged champ still enjoys playful moments and bursts of happy energy when he's with his favourite people! He gets along wonderfully with other dogs, is patient and kind with puppies and children.

All he's looking for now is a warm, loving home where he can enjoy cuddles, good food, and a comfy bed.`,
      beforeImage: '/images/dogs/khao-hom.png',
      afterImage: '/images/dogs/khao-hom-2.png',
      isFeatured: false,
      isPublished: true,
    },
    {
      slug: 'wan-and-peach',
      dogName: 'Wan',
      title: 'Teaching a Friend to Trust Again',
      summary: 'Wan helped a neglected Pitbull named Peach learn how to play and trust again, showing what friendship and patience look like.',
      content: `Wan has been a favourite at Baan Maa for her kind spirit and gentle way with others. One of her proudest moments was helping a neglected Pitbull named Peach learn how to play again.

Peach had been through a lot and didn't know how to interact with other dogs or trust people. But Wan was patient. Day after day, she would sit beside Peach, gently encouraging her to play, showing her what friendship and trust look like.

Slowly, Peach began to open up. The two became inseparable, and Peach learned that the world could be a kind and safe place.

That same calm, loving energy is what makes Wan so special. She is always ready for a walk, a cuddle, or a quiet moment by your side. Wan is now ready to find a family of her own.`,
      beforeImage: '/images/dogs/wan.png',
      afterImage: '/images/dogs/wan-2.png',
      isFeatured: false,
      isPublished: true,
    },
  ];

  for (const story of successStories) {
    await prisma.successStory.create({ data: story });
  }
  console.log(`✅ Created ${successStories.length} success stories`);

  // ==========================================================================
  // Create Appeals
  // ==========================================================================
  const appeals = [
    {
      slug: 'khao-hom-ongoing-care',
      title: "Khao Hom's Ongoing Care",
      dogName: 'Khao Hom',
      summary: 'Three-legged Khao Hom needs ongoing joint support supplements and regular check-ups to keep him comfortable and healthy.',
      content: `Khao Hom lost his leg after we found him struggling in the rice fields with a severe infection. Despite losing a limb, he never lost his spark and has adapted beautifully.

As a tripod dog, Khao Hom requires ongoing care including joint support supplements, regular veterinary check-ups, and a balanced diet to keep him comfortable and mobile.

Your donation will help cover:
- Monthly joint support supplements
- Regular veterinary check-ups
- Balanced nutrition tailored to his needs
- Comfortable bedding for his joints

Khao Hom is a gentle, loving boy who deserves the best care we can give him. Every donation helps us keep him happy, healthy, and comfortable.`,
      goalAmount: 2000,
      raisedAmount: 850,
      featuredImage: '/images/dogs/khao-hom.png',
      isActive: true,
      isUrgent: false,
      priority: 8,
    },
    {
      slug: 'emergency-flood-rescue',
      title: 'Emergency Flood Rescue',
      summary: 'Severe flooding has left dozens of dogs stranded. We need to rescue them NOW before the waters rise further.',
      content: `Heavy monsoon rains have caused severe flooding in the Tha Yang district. Dozens of street dogs are stranded on rooftops and in flooded areas, with no food or clean water.

Our rescue team is working around the clock, but we need your help. We've already rescued 15 dogs, but there are many more out there who need us.

Your donation will help cover:
- Boat rental for rescue operations
- Emergency veterinary care for rescued dogs
- Temporary housing and food
- Antibiotics and treatments for water-borne infections

Time is critical. The floodwaters are still rising, and these dogs cannot survive much longer without help.

Please give what you can \u2013 every pound helps us save another life.`,
      goalAmount: 5000,
      raisedAmount: 2340,
      featuredImage: '/images/appeals/flood-rescue.jpg',
      isActive: true,
      isUrgent: true,
      priority: 10,
      deadline: new Date('2026-03-15'),
    },
    {
      slug: 'coco-allergy-treatment',
      title: "Coco's Allergy Treatment",
      dogName: 'Coco',
      summary: 'Coco is being assessed for allergies causing skin irritation. Help us cover her ongoing treatment and care.',
      content: `After arriving emaciated and nearly blind, Coco has made an incredible recovery. But she is currently being assessed for allergies which cause skin irritation at times.

While these are manageable and don't affect her enjoyment of life, the treatment and assessment costs add up. Coco needs:
- Ongoing allergy testing and assessment
- Specialised medication for skin irritation
- Hypoallergenic food options
- Regular veterinary monitoring

Coco has been through so much and deserves the best care we can give. She is a sweet, loving girl who just wants to be someone's companion. Help us keep her comfortable while we find her the right treatment plan.`,
      goalAmount: 1500,
      raisedAmount: 420,
      featuredImage: '/images/dogs/coco.png',
      isActive: true,
      isUrgent: false,
      priority: 7,
    },
    {
      slug: 'monthly-food-program',
      title: 'Monthly Food Program',
      summary: 'Help us feed all our rescue dogs for a month. Every meal matters.',
      content: `Baan Maa is home to many rescue dogs who all need nutritious food daily. As our family grows with new rescues, so do our food costs.

Your donation will help us:
- Provide balanced, nutritious meals for all our dogs
- Purchase specialised food for dogs with dietary needs
- Stock treats for training and enrichment
- Maintain a reserve for emergency arrivals

Every meal matters. A well-fed dog is a happy, healthy dog. Please help us ensure none of our rescues ever go hungry again.`,
      goalAmount: 2000,
      raisedAmount: 1200,
      featuredImage: '/images/dogs/danny.png',
      isActive: true,
      isUrgent: false,
      priority: 5,
    },
  ];

  for (const appeal of appeals) {
    await prisma.appeal.create({ data: appeal });
  }
  console.log(`✅ Created ${appeals.length} appeals`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
