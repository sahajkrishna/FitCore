import balancedDietImg from "@/assets/nutrition/balanced-diet.jpg";
import muscleBuildingImg from "@/assets/nutrition/muscle-building.jpg";
import fatLossImg from "@/assets/nutrition/fat-loss.jpg";
import prePostImg from "@/assets/nutrition/pre-post-workout.jpg";
import mealPlanImg from "@/assets/nutrition/meal-plan.jpg";

export interface NutritionGuide {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
  premium?: boolean;
  sections: { heading: string; body: string; image?: string }[];
}

export const nutritionCategories = ["All", "Basics", "Muscle Building", "Fat Loss", "Meal Planning"];

export const nutritionGuides: NutritionGuide[] = [
  {
    slug: "balanced-diet-basics",
    title: "Balanced Diet Basics",
    excerpt: "Understand the foundation of healthy eating — proteins, carbs, and healthy fats — and how to build balanced meals every day.",
    category: "Basics",
    image: balancedDietImg,
    author: "Dr. Sarah Chen",
    readTime: "8 min",
    sections: [
      {
        heading: "The Three Macronutrients",
        body: "Every food you eat is made up of three macronutrients: proteins, carbohydrates, and fats. Each plays a critical role in your body's functioning.\n\n**Protein** builds and repairs muscle tissue, supports immune function, and keeps you feeling full. Aim for 1.6–2.2g per kg of body weight if you're active.\n\n**Carbohydrates** are your body's primary energy source. They fuel your brain, muscles, and nervous system. Focus on complex carbs like whole grains, sweet potatoes, and oats.\n\n**Healthy Fats** support hormone production, brain health, and nutrient absorption. Include avocados, nuts, olive oil, and fatty fish in your diet.",
        image: balancedDietImg,
      },
      {
        heading: "Building a Balanced Plate",
        body: "A simple framework for every meal:\n\n• **½ plate vegetables** — colorful, fiber-rich, and nutrient-dense\n• **¼ plate lean protein** — chicken, fish, tofu, eggs, or legumes\n• **¼ plate complex carbs** — brown rice, quinoa, sweet potato, or whole grain bread\n• **A thumb-sized portion of healthy fats** — olive oil, avocado, or nuts\n\nThis approach ensures you get all essential nutrients without needing to count every calorie.",
      },
      {
        heading: "Sample Balanced Meals",
        body: "**Breakfast**: Greek yogurt with berries, granola, and a drizzle of honey. Add a handful of almonds for healthy fats.\n\n**Lunch**: Grilled chicken salad with mixed greens, cherry tomatoes, cucumber, avocado, quinoa, and lemon-olive oil dressing.\n\n**Dinner**: Baked salmon with roasted sweet potato, steamed broccoli, and a side of brown rice.\n\n**Snack**: Apple slices with almond butter, or hummus with carrot and celery sticks.",
      },
      {
        heading: "Common Nutrition Mistakes",
        body: "• **Skipping meals** — leads to overeating later and energy crashes\n• **Cutting entire food groups** — unless medically necessary, your body needs variety\n• **Ignoring fiber** — aim for 25–35g daily from vegetables, fruits, and whole grains\n• **Drinking calories** — sodas, juices, and fancy coffees can add 500+ hidden calories\n• **Not eating enough protein** — especially common in people new to fitness",
      },
    ],
  },
  {
    slug: "muscle-building-nutrition",
    title: "Muscle Building Nutrition",
    excerpt: "Learn the nutrition fundamentals that drive muscle growth — from protein intake to meal timing and the best foods for gains.",
    category: "Muscle Building",
    image: muscleBuildingImg,
    author: "Coach Alex",
    readTime: "9 min",
    sections: [
      {
        heading: "Protein: The Muscle Builder",
        body: "Protein provides the amino acids your muscles need to repair and grow after training. Research consistently supports consuming 1.6–2.2 grams of protein per kilogram of body weight per day.\n\n**Top Protein Sources:**\n• Chicken breast — 31g per 100g\n• Greek yogurt — 10g per 100g\n• Eggs — 6g each\n• Lean beef — 26g per 100g\n• Whey protein powder — 25g per scoop\n• Cottage cheese — 11g per 100g\n\nDistribute protein across 4–5 meals throughout the day to optimize muscle protein synthesis.",
        image: muscleBuildingImg,
      },
      {
        heading: "Caloric Surplus for Growth",
        body: "To build muscle, you need to eat more calories than you burn — a caloric surplus. A surplus of 200–400 calories above maintenance is ideal for lean gains without excessive fat.\n\nCalculate your Total Daily Energy Expenditure (TDEE) and add 300 calories as a starting point. Track your weight weekly — aim for 0.25–0.5 kg per week gain.\n\n**Macronutrient Split for Muscle Building:**\n• Protein: 2g per kg body weight\n• Carbs: 4–6g per kg body weight\n• Fats: 0.8–1.2g per kg body weight",
      },
      {
        heading: "Best Foods for Muscle Growth",
        body: "Stock your kitchen with these muscle-building staples:\n\n• **Lean proteins**: Chicken, turkey, fish, lean beef, eggs\n• **Complex carbs**: Oats, brown rice, sweet potatoes, whole grain pasta\n• **Healthy fats**: Avocado, olive oil, almonds, salmon\n• **Dairy**: Greek yogurt, cottage cheese, milk\n• **Vegetables**: Broccoli, spinach, bell peppers (micronutrients for recovery)\n\n**Quick Muscle-Building Meals:**\n1. Chicken stir-fry with brown rice and vegetables\n2. Salmon with quinoa and asparagus\n3. Protein smoothie with banana, oats, peanut butter, and milk",
      },
      {
        heading: "Post-Workout Nutrition Window",
        body: "After training, your muscles are primed for nutrient absorption. While the \"anabolic window\" isn't as narrow as once thought, eating within 2 hours of training is beneficial.\n\n**Ideal Post-Workout Meal:**\n• 30–40g protein (whey shake or chicken)\n• 50–80g carbohydrates (rice, potatoes, or fruit)\n• Minimal fat (slows absorption slightly)\n\n**Quick Post-Workout Options:**\n• Protein shake with a banana\n• Chicken wrap with rice\n• Greek yogurt with granola and berries\n• Chocolate milk (ideal 4:1 carb-to-protein ratio)",
      },
    ],
  },
  {
    slug: "fat-loss-nutrition",
    title: "Fat Loss Nutrition",
    excerpt: "Discover the science-backed nutrition strategies for sustainable fat loss — no crash diets, just smart food choices.",
    category: "Fat Loss",
    image: fatLossImg,
    author: "Dr. Sarah Chen",
    readTime: "7 min",
    sections: [
      {
        heading: "Understanding Calorie Deficit",
        body: "Fat loss happens when you consume fewer calories than your body burns — a calorie deficit. A moderate deficit of 300–500 calories per day is sustainable and effective.\n\n**How to calculate your deficit:**\n1. Find your TDEE (Total Daily Energy Expenditure)\n2. Subtract 300–500 calories\n3. Track your intake for the first 2–3 weeks\n4. Adjust based on weekly weigh-ins (aim for 0.5–1 kg/week loss)\n\nAvoiding crash diets is critical — extreme deficits (1000+ calories) lead to muscle loss, metabolic slowdown, and eventual rebound weight gain.",
        image: fatLossImg,
      },
      {
        heading: "Foods That Support Fat Loss",
        body: "Focus on foods that are high in volume but low in calories, keeping you full while staying in a deficit:\n\n**High-Satiety Foods:**\n• Leafy greens (spinach, kale, arugula)\n• Lean proteins (chicken breast, white fish, egg whites)\n• Cruciferous vegetables (broccoli, cauliflower)\n• Berries (high fiber, low calorie)\n• Legumes (lentils, chickpeas — high fiber and protein)\n\n**Foods to Minimize:**\n• Processed snacks and chips\n• Sugary drinks and juices\n• Fried foods\n• Alcohol (empty calories and impairs fat metabolism)",
      },
      {
        heading: "Healthy Snack Options",
        body: "Smart snacking prevents overeating at main meals:\n\n• **Apple with 1 tbsp almond butter** — 200 cal, satisfying crunch\n• **Greek yogurt with berries** — 150 cal, high protein\n• **Handful of almonds (15–20)** — 160 cal, healthy fats\n• **Carrot sticks with hummus** — 120 cal, fiber-rich\n• **Rice cakes with cottage cheese** — 130 cal, quick and easy\n• **Hard-boiled eggs (2)** — 140 cal, portable protein\n\n**Rule of thumb**: Keep snacks under 200 calories and include protein or fiber to stay full.",
      },
      {
        heading: "Sustainable Fat Loss Habits",
        body: "Long-term fat loss is about habits, not willpower:\n\n• **Meal prep** — Prepare meals in advance to avoid impulsive choices\n• **Eat slowly** — It takes 20 minutes for fullness signals to reach your brain\n• **Stay hydrated** — Thirst is often mistaken for hunger\n• **Sleep 7–9 hours** — Poor sleep increases hunger hormones (ghrelin)\n• **Don't restrict foods entirely** — Allow yourself treats in moderation (80/20 rule)\n• **Track progress with photos**, not just the scale — body composition matters more than weight",
      },
    ],
  },
  {
    slug: "pre-and-post-workout-nutrition",
    title: "Pre & Post Workout Nutrition",
    excerpt: "Maximize your workout performance and recovery by eating the right foods at the right time.",
    category: "Meal Planning",
    image: prePostImg,
    author: "Coach Alex",
    readTime: "6 min",
    premium: true,
    sections: [
      {
        heading: "What to Eat Before Workouts",
        body: "Your pre-workout meal fuels performance. Eat 1–3 hours before training:\n\n**2–3 Hours Before (Full Meal):**\n• Grilled chicken with sweet potato and vegetables\n• Oatmeal with banana and protein powder\n• Turkey sandwich on whole grain bread\n\n**30–60 Minutes Before (Light Snack):**\n• Banana with peanut butter\n• Rice cakes with honey\n• A small protein smoothie\n• Handful of dried fruit and nuts\n\n**Key Principle**: Combine easily digestible carbs with moderate protein. Avoid high-fat and high-fiber foods close to training as they slow digestion.",
        image: prePostImg,
      },
      {
        heading: "What to Eat After Workouts",
        body: "Post-workout nutrition repairs muscle damage and replenishes energy stores. Eat within 1–2 hours after training.\n\n**Ideal Post-Workout Meal Components:**\n• 25–40g protein for muscle repair\n• 40–80g carbohydrates for glycogen replenishment\n• Moderate fat is okay\n\n**Great Post-Workout Meals:**\n• Protein shake with banana and oats\n• Grilled chicken with rice and vegetables\n• Salmon with quinoa and avocado\n• Greek yogurt parfait with granola and berries\n• Eggs on whole grain toast with avocado",
      },
      {
        heading: "Hydration Tips for Training",
        body: "Even mild dehydration (2% body weight loss) can decrease performance by up to 25%.\n\n**Before Exercise:**\n• Drink 500ml water 2–3 hours before\n• Drink 250ml 15 minutes before starting\n\n**During Exercise:**\n• Sip 150–250ml every 15–20 minutes\n• For sessions over 60 minutes, add electrolytes (sodium, potassium)\n\n**After Exercise:**\n• Replace 150% of fluid lost during exercise\n• Weigh yourself before and after — each kg lost = 1.5 liters to drink\n• Coconut water is a natural electrolyte drink\n\n**Signs of dehydration**: dark urine, headache, fatigue, decreased performance.",
      },
      {
        heading: "Supplements Worth Considering",
        body: "While whole foods should be your foundation, a few supplements have strong research support:\n\n• **Whey Protein** — Convenient way to hit protein targets. Take post-workout or between meals.\n• **Creatine Monohydrate** (5g/day) — Improves strength, power, and muscle recovery. The most researched supplement in sports nutrition.\n• **Caffeine** (200–400mg) — Enhances focus and endurance. Take 30–60 minutes pre-workout.\n• **Electrolytes** — Essential during long or intense sessions, especially in heat.\n\n**Skip**: Fat burners, BCAAs (redundant if protein intake is adequate), and anything with proprietary blends.",
      },
    ],
  },
  {
    slug: "healthy-daily-meal-plan",
    title: "Healthy Daily Meal Plan",
    excerpt: "A complete day of eating designed for active individuals — balanced, delicious, and easy to prepare.",
    category: "Meal Planning",
    image: mealPlanImg,
    author: "Dr. Sarah Chen",
    readTime: "7 min",
    premium: true,
    sections: [
      {
        heading: "Breakfast: Power Start (7:00 AM)",
        body: "Start your day with a nutrient-dense meal that provides sustained energy:\n\n**Option 1: Overnight Oats**\n• ½ cup rolled oats\n• 1 cup Greek yogurt\n• ½ cup mixed berries\n• 1 tbsp chia seeds\n• Drizzle of honey\n• Handful of walnuts\n\n**Option 2: Protein Scramble**\n• 3 egg whites + 1 whole egg\n• Sautéed spinach and mushrooms\n• ½ avocado on whole grain toast\n• Side of fresh fruit\n\n**Approx. Calories**: 450–550 | **Protein**: 30–35g",
        image: mealPlanImg,
      },
      {
        heading: "Lunch: Midday Fuel (12:30 PM)",
        body: "A balanced lunch keeps energy levels stable through the afternoon:\n\n**Option 1: Mediterranean Bowl**\n• Grilled chicken breast (150g)\n• Quinoa (1 cup cooked)\n• Cherry tomatoes, cucumber, red onion\n• Feta cheese crumbles\n• Olive oil and lemon dressing\n• Side of hummus\n\n**Option 2: Asian Stir-Fry**\n• Lean beef strips or tofu (150g)\n• Brown rice (1 cup cooked)\n• Mixed stir-fry vegetables\n• Low-sodium soy sauce and ginger\n\n**Approx. Calories**: 550–650 | **Protein**: 40–45g",
      },
      {
        heading: "Dinner: Recovery Meal (7:00 PM)",
        body: "Dinner supports overnight recovery and muscle repair:\n\n**Option 1: Baked Salmon Plate**\n• Salmon fillet (180g)\n• Roasted sweet potato (1 medium)\n• Steamed broccoli and green beans\n• Drizzle of olive oil and herbs\n\n**Option 2: Turkey Meatballs**\n• Lean turkey meatballs (150g)\n• Whole grain pasta (1 cup cooked)\n• Homemade tomato sauce with vegetables\n• Side salad with mixed greens\n\n**Approx. Calories**: 550–650 | **Protein**: 40–50g",
      },
      {
        heading: "Snacks: Smart Choices Throughout the Day",
        body: "Keep 2–3 snacks between meals to maintain energy:\n\n**Mid-Morning (10:00 AM):**\n• Apple with 1 tbsp almond butter (200 cal)\n• Or a protein bar (look for 20g+ protein, <10g sugar)\n\n**Afternoon (3:30 PM):**\n• Greek yogurt with a handful of mixed nuts (180 cal)\n• Or carrots and celery with hummus (150 cal)\n\n**Evening (optional, 9:00 PM):**\n• Cottage cheese with cinnamon (120 cal) — casein protein supports overnight recovery\n• Or a small handful of dark chocolate almonds (150 cal)\n\n**Daily Total: ~2,000–2,200 calories | 140–160g protein**\n\nAdjust portions up or down based on your goals (muscle building = add 300 cal; fat loss = subtract 300 cal).",
      },
    ],
  },
];
