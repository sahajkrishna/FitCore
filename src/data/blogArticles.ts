import strengthImg from "@/assets/blog/strength-training.jpg";
import cardioImg from "@/assets/blog/cardio-fat-loss.jpg";
import nutritionImg from "@/assets/blog/nutrition-muscle.jpg";
import energyImg from "@/assets/blog/energy-foods.jpg";
import stretchingImg from "@/assets/blog/stretching.jpg";

export type BlogCategory = "Strength Training" | "Cardio" | "Nutrition" | "Recovery";

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  image: string;
  author: string;
  date: string;
  readTime: string;
  sections: { heading: string; body: string; image?: string }[];
}

export const categories: BlogCategory[] = ["Strength Training", "Cardio", "Nutrition", "Recovery"];

export const articles: BlogArticle[] = [
  {
    slug: "beginners-guide-to-strength-training",
    title: "Beginner's Guide to Strength Training",
    excerpt: "Compound movements recruit multiple muscle groups simultaneously, making them the most efficient way to build strength and muscle as a beginner.",
    category: "Strength Training",
    image: strengthImg,
    author: "Coach Alex",
    date: "Mar 5, 2026",
    readTime: "8 min",
    sections: [
      {
        heading: "Why Strength Training Matters",
        body: "Strength training is the foundation of any fitness program. It builds lean muscle mass, increases your metabolism, strengthens bones and joints, and improves everyday functional movement. Whether your goal is fat loss, athletic performance, or simply feeling stronger, resistance training should be a core part of your routine.\n\nResearch shows that just two to three sessions per week can produce significant improvements in strength, body composition, and overall health markers within 8–12 weeks.",
      },
      {
        heading: "The Big 5 Compound Exercises",
        body: "Focus on these five foundational movements to build a balanced physique:\n\n1. **Barbell Squat** — Works quads, glutes, hamstrings, and core. Start with bodyweight squats and progress to a barbell.\n\n2. **Bench Press** — Develops chest, shoulders, and triceps. Use a spotter when lifting heavy.\n\n3. **Deadlift** — The king of posterior chain exercises, targeting back, glutes, and hamstrings.\n\n4. **Overhead Press** — Builds shoulder strength and stability. Can be done seated or standing.\n\n5. **Barbell Row** — Strengthens the entire back and improves posture.",
        image: strengthImg,
      },
      {
        heading: "Programming for Beginners",
        body: "Start with 3 full-body sessions per week, allowing at least 48 hours between sessions for recovery. Aim for 3–4 sets of 8–12 reps per exercise. Begin with a weight you can control with good form and increase by 2.5–5 kg each week (progressive overload).\n\nA sample week might look like:\n- **Monday**: Squat, Bench Press, Row\n- **Wednesday**: Deadlift, Overhead Press, Pull-ups\n- **Friday**: Squat variation, Bench variation, Row variation",
      },
      {
        heading: "Common Mistakes to Avoid",
        body: "• **Ego lifting** — Using too much weight at the expense of form leads to injuries. Check your ego at the door.\n\n• **Skipping warm-ups** — Always perform 5–10 minutes of light cardio and dynamic stretches before lifting.\n\n• **Neglecting recovery** — Muscles grow during rest, not during the workout. Sleep 7–9 hours and eat enough protein (1.6–2.2g per kg of body weight).\n\n• **Program hopping** — Stick with one program for at least 8–12 weeks before switching.",
      },
    ],
  },
  {
    slug: "10-cardio-workouts-for-fat-loss",
    title: "10 Cardio Workouts for Fat Loss",
    excerpt: "Discover the most effective cardio workouts that maximize calorie burn and boost your metabolism for lasting fat loss.",
    category: "Cardio",
    image: cardioImg,
    author: "Coach Maya",
    date: "Mar 2, 2026",
    readTime: "7 min",
    sections: [
      {
        heading: "Cardio and Fat Loss: The Science",
        body: "Cardiovascular exercise creates a calorie deficit by burning energy during and after your workout. High-intensity activities trigger Excess Post-Exercise Oxygen Consumption (EPOC), meaning your body continues to burn calories for hours after you finish training.\n\nThe key is finding activities you enjoy so you stay consistent. Variety also prevents adaptation, keeping your body challenged.",
      },
      {
        heading: "Top 10 Fat-Burning Workouts",
        body: "1. **HIIT Sprints** — 20 seconds all-out, 40 seconds rest. Repeat for 15–20 minutes.\n\n2. **Jump Rope** — Burns up to 1,000 calories per hour. Start with 1-minute intervals.\n\n3. **Cycling Intervals** — Alternate between high resistance sprints and easy pedaling.\n\n4. **Rowing Machine** — Full-body workout that torches calories while being easy on joints.\n\n5. **Swimming** — Low-impact, high-calorie burn. Great for active recovery days.\n\n6. **Stair Climbing** — Use a stair machine or find real stairs for a brutal leg and cardio workout.\n\n7. **Boxing / Kickboxing** — Combines coordination, strength, and cardio in one session.\n\n8. **Trail Running** — Varied terrain engages more muscles than flat treadmill running.\n\n9. **Dance-Based Workouts** — Fun, social, and surprisingly intense.\n\n10. **Kettlebell Circuits** — Swings, cleans, and snatches keep your heart rate elevated.",
        image: cardioImg,
      },
      {
        heading: "How to Structure Your Cardio Week",
        body: "For optimal fat loss, aim for 3–4 cardio sessions per week alongside 2–3 strength training sessions.\n\n- **2 HIIT sessions** (20–30 min each)\n- **1–2 Steady-state sessions** (30–45 min at moderate intensity)\n- **1 Active recovery** day (walking, yoga, swimming)\n\nAvoid doing more than 5 intense sessions per week to prevent overtraining and elevated cortisol levels.",
      },
      {
        heading: "Nutrition Supports Fat Loss",
        body: "You can't out-train a bad diet. Pair your cardio routine with a moderate calorie deficit (300–500 kcal below maintenance). Prioritize protein to preserve muscle mass, eat plenty of vegetables for micronutrients, and stay hydrated. Track your intake for the first few weeks to build awareness of portion sizes.",
      },
    ],
  },
  {
    slug: "nutrition-basics-for-muscle-growth",
    title: "Nutrition Basics for Muscle Growth",
    excerpt: "Understanding the fundamentals of nutrition is essential for maximizing muscle growth and recovery from training.",
    category: "Nutrition",
    image: nutritionImg,
    author: "Dr. Sarah Chen",
    date: "Feb 27, 2026",
    readTime: "9 min",
    sections: [
      {
        heading: "Calories: The Foundation",
        body: "To build muscle, you need a caloric surplus — consuming more calories than you burn. A surplus of 200–400 calories above your maintenance level is ideal for lean gains without excessive fat accumulation.\n\nCalculate your Total Daily Energy Expenditure (TDEE) using an online calculator and add 300 calories as a starting point. Adjust based on weekly weight changes (aim for 0.25–0.5 kg per week).",
      },
      {
        heading: "Protein: The Building Block",
        body: "Protein provides the amino acids your muscles need to repair and grow. Research consistently supports consuming 1.6–2.2 grams of protein per kilogram of body weight per day for optimal muscle protein synthesis.\n\n**Top Protein Sources:**\n- Chicken breast (31g per 100g)\n- Greek yogurt (10g per 100g)\n- Eggs (6g each)\n- Lean beef (26g per 100g)\n- Whey protein powder (25g per scoop)\n- Lentils & beans (plant-based option)",
        image: nutritionImg,
      },
      {
        heading: "Carbs and Fats: Fuel and Hormones",
        body: "**Carbohydrates** fuel your workouts and replenish glycogen stores. Aim for 3–5g per kg body weight. Prioritize complex carbs: oats, sweet potatoes, brown rice, and whole grains.\n\n**Fats** are essential for hormone production (including testosterone). Consume 0.8–1.2g per kg body weight from sources like avocados, nuts, olive oil, and fatty fish.",
      },
      {
        heading: "Meal Timing and Frequency",
        body: "While total daily intake matters most, distributing protein across 4–5 meals (every 3–4 hours) can optimize muscle protein synthesis. Key windows:\n\n- **Pre-workout** (1–2 hours before): Carbs + protein for energy.\n- **Post-workout** (within 2 hours): Protein + carbs for recovery.\n- **Before bed**: Casein protein or Greek yogurt for overnight repair.\n\nDon't stress about perfect timing — consistency with total intake is far more important than meal timing.",
      },
    ],
  },
  {
    slug: "best-foods-for-energy-and-recovery",
    title: "Best Foods for Energy and Recovery",
    excerpt: "Fuel your workouts and speed up recovery with these science-backed food choices that every athlete should know.",
    category: "Nutrition",
    image: energyImg,
    author: "Dr. Sarah Chen",
    date: "Feb 22, 2026",
    readTime: "6 min",
    sections: [
      {
        heading: "Pre-Workout Energy Foods",
        body: "What you eat before training directly impacts your performance. The ideal pre-workout meal combines easily digestible carbs with moderate protein:\n\n- **Banana + peanut butter** — Quick energy with sustained release.\n- **Oatmeal with berries** — Complex carbs for longer sessions.\n- **Rice cakes with honey** — Fast-digesting fuel for early morning workouts.\n- **Smoothie** (banana, protein powder, spinach) — Easy to digest and nutrient-dense.",
        image: energyImg,
      },
      {
        heading: "Post-Workout Recovery Foods",
        body: "After training, your body needs protein to repair muscle tissue and carbohydrates to replenish glycogen stores:\n\n- **Grilled chicken with sweet potato** — The classic muscle-building meal.\n- **Greek yogurt with granola and fruit** — Convenient and protein-rich.\n- **Salmon with quinoa** — Omega-3 fatty acids reduce inflammation.\n- **Chocolate milk** — Surprisingly effective recovery drink with ideal carb-to-protein ratio.\n- **Eggs on whole grain toast** — Simple, effective, and affordable.",
      },
      {
        heading: "Hydration for Performance",
        body: "Even mild dehydration (2% body weight loss) can decrease performance by up to 25%. Follow these guidelines:\n\n- Drink **500ml water** 2 hours before exercise.\n- Sip **150–250ml** every 15–20 minutes during training.\n- Post-workout: Replace **150%** of fluid lost (weigh yourself before and after).\n- For sessions over 60 minutes, consider an electrolyte drink with sodium and potassium.",
      },
      {
        heading: "Sleep-Boosting Foods for Recovery",
        body: "Recovery happens primarily during sleep. These foods promote better sleep quality:\n\n- **Tart cherry juice** — Natural source of melatonin.\n- **Magnesium-rich foods** (almonds, spinach, dark chocolate) — Promote muscle relaxation.\n- **Turkey** — Contains tryptophan, a precursor to serotonin and melatonin.\n- **Chamomile tea** — Calming effects support sleep onset.\n\nAim for 7–9 hours of quality sleep per night for optimal recovery and muscle growth.",
      },
    ],
  },
  {
    slug: "importance-of-stretching-and-flexibility",
    title: "Importance of Stretching and Flexibility",
    excerpt: "Flexibility training is often overlooked but plays a crucial role in injury prevention, performance, and long-term mobility.",
    category: "Recovery",
    image: stretchingImg,
    author: "Coach Maya",
    date: "Feb 18, 2026",
    readTime: "7 min",
    sections: [
      {
        heading: "Why Flexibility Matters",
        body: "Flexibility is the ability of your muscles and joints to move through their full range of motion. Good flexibility:\n\n- **Prevents injuries** by allowing muscles to handle unexpected movements.\n- **Improves performance** by enabling deeper squats, better overhead positions, and more efficient running form.\n- **Reduces pain** by releasing muscle tension and correcting imbalances.\n- **Speeds recovery** by promoting blood flow to worked muscles.\n\nAs we age, flexibility naturally decreases — making regular stretching even more important.",
        image: stretchingImg,
      },
      {
        heading: "Dynamic vs. Static Stretching",
        body: "**Dynamic stretching** (before workouts): Controlled movements that take your joints through their range of motion. Examples include leg swings, arm circles, walking lunges, and high knees. These warm up muscles and prepare them for activity.\n\n**Static stretching** (after workouts): Holding a stretch for 20–30 seconds. Best done when muscles are warm. Examples include hamstring stretch, quad stretch, chest doorway stretch, and seated forward fold.\n\n**Rule of thumb**: Dynamic before, static after.",
      },
      {
        heading: "A 10-Minute Daily Flexibility Routine",
        body: "Perform this routine every morning or after workouts:\n\n1. **Cat-Cow stretch** — 1 minute (spine mobility)\n2. **World's Greatest Stretch** — 1 minute per side (hips, thoracic spine)\n3. **Downward Dog to Cobra flow** — 2 minutes (hamstrings, hip flexors, shoulders)\n4. **Pigeon Pose** — 1 minute per side (deep hip opener)\n5. **Shoulder cross-body stretch** — 30 seconds per side\n6. **Seated spinal twist** — 1 minute per side\n\nConsistency matters more than intensity — 10 minutes daily beats one 60-minute session per week.",
      },
      {
        heading: "Foam Rolling and Mobility Work",
        body: "Foam rolling (self-myofascial release) is a powerful complement to stretching. It breaks up adhesions in muscle tissue and increases blood flow.\n\n**Key areas to foam roll:**\n- IT band and quads\n- Upper back (thoracic spine)\n- Glutes and piriformis\n- Calves\n\nSpend 1–2 minutes per muscle group, pausing on tender spots for 20–30 seconds. Combine foam rolling with stretching for maximum mobility gains.",
      },
    ],
  },
];
