import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = "portfolio";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postSlug = searchParams.get('postSlug');

    if (!postSlug) {
      return NextResponse.json({ error: "postSlug is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Fetch only approved comments OR legacy comments that lack a status field
    const comments = await db.collection("comments")
      .find({ 
        postSlug,
        $or: [
          { status: "approved" },
          { status: { $exists: false } }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { postSlug, text } = await req.json();
    
    // Server-side validation
    if (!text || text.trim() === "" || text.length > 1000) {
      return NextResponse.json({ error: "Invalid comment content" }, { status: 400 });
    }

    if (!postSlug) {
      return NextResponse.json({ error: "Target post is required" }, { status: 400 });
    }
    
    const animals = [
      { name: "Happy Ducky", icon: "🦆" },
      { name: "Playful Penguin", icon: "🐧" },
      { name: "Gentle Jumbo", icon: "🐘" },
      { name: "Clever Fox", icon: "🦊" },
      { name: "Cheerful Otter", icon: "🦦" },
      { name: "Cuddly Panda", icon: "🐼" },
      { name: "Peaceful Koala", icon: "🐨" },
      { name: "Brave Lion", icon: "🦁" },
      { name: "Fabulous Tiger", icon: "🐯" },
      { name: "Spotted Leopard", icon: "🐆" },
      { name: "Swift Cheetah", icon: "🐆" },
      { name: "Loyal Wolf", icon: "🐺" },
      { name: "Friendly Dog", icon: "🐶" },
      { name: "Curious Cat", icon: "🐱" },
      { name: "Tiny Mouse", icon: "🐭" },
      { name: "Smart Rat", icon: "🐭" },
      { name: "Fluffy Hamster", icon: "🐹" },
      { name: "Bouncy Rabbit", icon: "🐰" },
      { name: "Strong Bear", icon: "🐻" },
      { name: "Cool Polar Bear", icon: "🐻‍❄️" },
      { name: "Playful Monkey", icon: "🐵" },
      { name: "Mighty Gorilla", icon: "🦍" },
      { name: "Wise Orangutan", icon: "🦧" },
      { name: "Spotted Cow", icon: "🐮" },
      { name: "Jolly Pig", icon: "🐷" },
      { name: "Jumping Frog", icon: "🐸" },
      { name: "Clucky Chicken", icon: "🐔" },
      { name: "Proud Rooster", icon: "🐓" },
      { name: "Thankful Turkey", icon: "🦃" },
      { name: "Wise Owl", icon: "🦉" },
      { name: "Majestic Eagle", icon: "🦅" },
      { name: "Soaring Hawk", icon: "🦅" },
      { name: "Colorful Parrot", icon: "🦜" },
      { name: "Graceful Swan", icon: "🦢" },
      { name: "Elegant Flamingo", icon: "🦩" },
      { name: "Radiant Peacock", icon: "🦚" },
      { name: "Peaceful Dove", icon: "🕊️" },
      { name: "Starry Bat", icon: "🦇" },
      { name: "Swimming Shark", icon: "🦈" },
      { name: "Gentle Whale", icon: "🐳" },
      { name: "Smart Dolphin", icon: "🐬" },
      { name: "Wiggly Octopus", icon: "🐙" },
      { name: "Speedy Squid", icon: "🦑" },
      { name: "Dancing Crab", icon: "🦀" },
      { name: "Colorful Lobster", icon: "🦞" },
      { name: "Tiny Shrimp", icon: "🦐" },
      { name: "Shiny Fish", icon: "🐟" },
      { name: "Puffy Blowfish", icon: "🐡" },
      { name: "Sunny Seal", icon: "🦭" },
      { name: "Smiling Crocodile", icon: "🐊" },
      { name: "Steady Turtle", icon: "🐢" },
      { name: "Smooth Snake", icon: "🐍" },
      { name: "Sunning Lizard", icon: "🦎" },
      { name: "Tremendous T-Rex", icon: "🦖" },
      { name: "Gentle Sauropod", icon: "🦕" },
      { name: "Galloping Horse", icon: "🐴" },
      { name: "Magical Unicorn", icon: "🦄" },
      { name: "Striped Zebra", icon: "🦓" },
      { name: "Graceful Deer", icon: "🦌" },
      { name: "Majestic Bison", icon: "🦬" },
      { name: "Wandering Buffalo", icon: "🐃" },
      { name: "Sturdy Ox", icon: "🐂" },
      { name: "Climbing Goat", icon: "🐐" },
      { name: "Woolly Sheep", icon: "🐑" },
      { name: "Desert Camel", icon: "🐫" },
      { name: "Fluffy Llama", icon: "🦙" },
      { name: "Tall Giraffe", icon: "🦒" },
      { name: "Happy Hippopotamus", icon: "🦛" },
      { name: "Heroic Rhinoceros", icon: "🦏" },
      { name: "Hopping Kangaroo", icon: "🦘" },
      { name: "Happy Sloth", icon: "🦥" },
      { name: "Sweet Skunk", icon: "🦨" },
      { name: "Clever Raccoon", icon: "🦝" },
      { name: "Brave Badger", icon: "🦡" },
      { name: "Busy Beaver", icon: "🦫" },
      { name: "Cute Hedgehog", icon: "🦔" },
      { name: "Quick Squirrel", icon: "🐿️" },
      { name: "Nimble Chipmunk", icon: "🐿️" },
      { name: "Hardworking Ant", icon: "🐜" },
      { name: "Buzzing Bee", icon: "🐝" },
      { name: "Lucky Ladybug", icon: "🐞" },
      { name: "Beautiful Butterfly", icon: "🦋" },
      { name: "Silver Snail", icon: "🐌" },
      { name: "Wiggly Worm", icon: "🪱" },
      { name: "Daring Scorpion", icon: "🦂" },
      { name: "Creative Spider", icon: "🕷️" },
      { name: "Zippy Mosquito", icon: "🦟" },
      { name: "Acrobatic Fly", icon: "🪰" },
      { name: "Speedy Cockroach", icon: "🪳" },
      { name: "Marvelous Microbe", icon: "🦠" },
      { name: "Soaring Turkey Vulture", icon: "🦅" },
      { name: "Diving Pelican", icon: "🦩" },
      { name: "Singing Canary", icon: "🐤" },
      { name: "Fluffy Chick", icon: "🐥" },
      { name: "Tiny Penguin Chick", icon: "🐧" },
      { name: "Courageous Ram", icon: "🐏" },
      { name: "Steadfast Donkey", icon: "🫏" },
      { name: "Awesome Mammoth", icon: "🦣" },
      { name: "Endearing Dodo", icon: "🦤" },
      { name: "Joyful Hyena", icon: "🐺" },
      { name: "Spotted Jaguar", icon: "🐆" },
      { name: "Sleek Panther", icon: "🐆" },
      { name: "Mountain Cougar", icon: "🐆" },
      { name: "Festive Reindeer", icon: "🦌" },
      { name: "Grand Moose", icon: "🦌" },
      { name: "Colorful Chameleon", icon: "🦎" },
      { name: "Stunning Gecko", icon: "🦎" },
      { name: "Green Iguana", icon: "🦎" },
      { name: "Mighty Komodo Dragon", icon: "🦎" },
      { name: "Swimming Alligator", icon: "🐊" },
      { name: "Shiny Barracuda", icon: "🐟" },
      { name: "Silver Salmon", icon: "🐟" },
      { name: "Speedy Tuna", icon: "🐟" },
      { name: "Tiny Seahorse", icon: "🐠" },
      { name: "Sparkly Starfish", icon: "⭐" },
      { name: "Floating Jellyfish", icon: "🎐" },
      { name: "Funny Clownfish", icon: "🐠" },
      { name: "Puffy Pufferfish", icon: "🐡" },
      { name: "Perky Woodpecker", icon: "🦜" },
      { name: "Chattering Magpie", icon: "🦜" },
      { name: "Tiny Sparrow", icon: "🐦" },
      { name: "Clever Crow", icon: "🐦‍⬛" },
      { name: "Dazzling Raven", icon: "🐦‍⬛" },
      { name: "Tropical Toucan", icon: "🦜" },
      { name: "Bright Kingfisher", icon: "🐦" },
      { name: "Fast Falcon", icon: "🦅" },
      { name: "Nautical Seagull", icon: "🐦" },
      { name: "Original Platypus", icon: "🦫" },
      { name: "Amazing Armadillo", icon: "🦔" },
      { name: "Burrowing Wombat", icon: "🐻" },
      { name: "Wonderful Tasmanian Devil", icon: "🐻" },
      { name: "Alert Meerkat", icon: "🦡" },
      { name: "Chill Capybara", icon: "🐹" },
      { name: "Rare Okapi", icon: "🦒" },
      { name: "Sweet Tapir", icon: "🦛" },
      { name: "Strong Yak", icon: "🐂" },
      { name: "Elegant Impala", icon: "🦌" },
      { name: "Swift Gazelle", icon: "🦌" },
      { name: "Graceful Antelope", icon: "🦌" },
      { name: "Hardy Mule", icon: "🐴" },
      { name: "Playful Ferret", icon: "🦦" },
      { name: "Sleek Weasel", icon: "🦦" },
      { name: "Fascinating Mongoose", icon: "🦦" },
      { name: "Precious Porcupine", icon: "🦔" },
      { name: "Charming Groundhog", icon: "🐹" },
      { name: "Soft Alpaca", icon: "🦙" },
      { name: "Gliding Condor", icon: "🦅" },
      { name: "Gentle Manatee", icon: "🦭" },
      { name: "Mystic Narwhal", icon: "🐳" },
      { name: "Powerful Orca", icon: "🐳" },
      { name: "Swift Swordfish", icon: "🐟" },
      { name: "Bright Blue Jay", icon: "🐦" },
      { name: "Happy Caterpillar", icon: "🐛" },
      { name: "Chirping Cricket", icon: "🦗" },
      { name: "Jumping Grasshopper", icon: "🦗" },
      { name: "Cute Centipede", icon: "🐛" },
      { name: "Radiant Millipede", icon: "🐛" },
      { name: "Busy Termite", icon: "🐜" },
      { name: "Glowing Firefly", icon: "🐞" },
      { name: "Dancing Dragonfly", icon: "🦋" }
    ];
    
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const newComment = {
      postSlug,
      text: text.trim(), 
      animalIdentity: randomAnimal.name,
      animalIcon: randomAnimal.icon,
      status: "pending", 
      adminReply: null,  
      createdAt: new Date()
    };

    await db.collection("comments").insertOne(newComment);
    
    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}