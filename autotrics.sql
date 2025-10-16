-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2025 at 07:47 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `autotrics`
--

-- --------------------------------------------------------

--
-- Table structure for table `alerts_and_reminders`
--

CREATE TABLE `alerts_and_reminders` (
  `reminder_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `car_id` int(11) NOT NULL,
  `reminder` varchar(255) NOT NULL,
  `interval_in_minutes` int(11) NOT NULL,
  `last_reminded_on` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reminder_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `car_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `car_make` varchar(255) NOT NULL,
  `car_model` varchar(255) NOT NULL,
  `car_milage` varchar(255) NOT NULL,
  `car_year` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`car_id`, `user_id`, `car_make`, `car_model`, `car_milage`, `car_year`, `created_at`) VALUES
(1, 2, 'Toyota', 'Camry', '123', '2003', '2025-10-08 12:20:08'),
(2, 2, 'Toyota', 'Matrix', '13000', '2001', '2025-10-11 19:04:27'),
(4, 2, 'Toyota', 'Hilux', '123000', '2021', '2025-10-11 21:01:54');

-- --------------------------------------------------------

--
-- Table structure for table `knowledge_hub_chats`
--

CREATE TABLE `knowledge_hub_chats` (
  `message_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sender_role` enum('user','assistant') NOT NULL DEFAULT 'user',
  `message` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `knowledge_hub_chats`
--

INSERT INTO `knowledge_hub_chats` (`message_id`, `user_id`, `sender_role`, `message`, `created_at`) VALUES
(12, 2, 'user', 'Can i know more about car maintenance', '2025-10-10 22:48:09'),
(13, 2, 'assistant', 'Okay, let\'s dive into car maintenance!  This is a broad topic, but I\'ll break it down into manageable sections. We\'ll cover the basics, the \"do-it-yourself\" options, and when to seek professional help.\n\n**I. Why is Car Maintenance Important?**\n\n*   **Safety:**  Well-maintained vehicles are safer.  Properly functioning brakes, tires, lights, and steering are crucial for avoiding accidents.\n*   **Reliability:** Regular maintenance reduces the risk of breakdowns and unexpected repairs, saving you time, money, and inconvenience.\n*   **Longevity:**  A maintained car lasts longer.  You\'ll get more years of use out of your vehicle, maximizing your investment.\n*   **Fuel Efficiency:**  Things like properly inflated tires, clean air filters, and functioning spark plugs contribute to better gas mileage.\n*   **Resale Value:**  A car with a documented maintenance history is more attractive to potential buyers and will command a higher price.\n*   **Warranty Compliance:** Neglecting required maintenance can void your car\'s warranty.\n\n**II. Key Areas of Car Maintenance:**\n\nHere\'s a breakdown of the critical systems that require regular attention:\n\n*   **Engine:**\n    *   **Oil Changes:** The most frequent and arguably the most important maintenance task. Oil lubricates the engine\'s moving parts, reducing friction and wear. Frequency depends on the oil type (conventional, synthetic blend, full synthetic) and your driving conditions (check your owner\'s manual).\n    *   **Air Filter:**  A clean air filter ensures the engine receives adequate airflow for combustion. Replace it regularly.\n    *   **Spark Plugs:** These ignite the air-fuel mixture in the cylinders.  Worn spark plugs can cause misfires, reduced fuel economy, and rough idling.\n    *   **Timing Belt/Chain:**  This synchronizes the engine\'s valves and pistons.  A broken timing belt can cause severe engine damage.  Replace it according to the manufacturer\'s recommendations.  Some engines have timing chains which usually last the life of the car, but may need replacement depending on wear.\n    *   **Coolant (Antifreeze):** Coolant regulates the engine\'s temperature, preventing overheating.  Check the coolant level and condition regularly and flush/replace it according to the manufacturer\'s schedule.\n    *   **Belts and Hoses:**  Inspect belts (serpentine belt, V-belts) for cracks, fraying, or glazing. Replace them as needed. Check hoses for leaks, cracks, or swelling.\n*   **Brakes:**\n    *   **Brake Pads/Shoes:** These create friction to slow the vehicle.  Inspect them regularly for wear and replace them when they get too thin.\n    *   **Brake Rotors/Drums:**  These are the surfaces that the pads/shoes press against. They can become worn, warped, or scored, requiring resurfacing or replacement.\n    *   **Brake Fluid:** Brake fluid transmits pressure from the brake pedal to the brakes.  It absorbs moisture over time, which can reduce braking effectiveness and corrode brake components.  Flush and replace brake fluid every few years.\n*   **Tires:**\n    *   **Tire Pressure:**  Maintain the correct tire pressure (listed on the sticker inside the driver\'s side door or in the owner\'s manual).  Underinflated tires reduce fuel economy, increase wear, and can lead to blowouts.\n    *   **Tire Rotation:** Rotating tires evenly distributes wear, extending their lifespan.\n    *   **Tire Tread:**  Check the tire tread depth regularly.  Worn tires reduce traction, especially in wet or snowy conditions.\n    *   **Wheel Alignment:** Proper wheel alignment ensures even tire wear and optimal handling.  Misalignment can be caused by hitting potholes or curbs.\n*   **Fluids:**\n    *   **Engine Oil:** Already covered above.\n    *   **Coolant:** Already covered above.\n    *   **Brake Fluid:** Already covered above.\n    *   **Power Steering Fluid:** If your car has hydraulic power steering, check the fluid level and condition.  Low fluid can cause steering problems.\n    *   **Transmission Fluid:**  Automatic transmissions require regular fluid changes to ensure smooth shifting.  The frequency depends on the vehicle and driving conditions.  Check your owner\'s manual.\n    *   **Windshield Washer Fluid:** Keep the reservoir filled for clear visibility.\n*   **Electrical System:**\n    *   **Battery:** Check the battery terminals for corrosion and clean them as needed.  Have the battery tested periodically to ensure it\'s holding a charge.\n    *   **Lights:**  Check all lights (headlights, taillights, brake lights, turn signals, interior lights) regularly and replace burned-out bulbs promptly.\n*   **Suspension and Steering:**\n    *   **Shocks and Struts:**  These control the vehicle\'s ride and handling.  Worn shocks/struts can cause a bouncy ride, poor handling, and increased tire wear.\n    *   **Suspension Components:** Inspect ball joints, tie rod ends, and other suspension components for wear and tear.\n*   **Exhaust System:**\n    *   **Exhaust Leaks:**  Listen for unusual noises coming from the exhaust system.  Exhaust leaks can be dangerous and reduce fuel economy.\n\n**III. Maintenance Schedule:**\n\n*   **Owner\'s Manual:** Your car\'s owner\'s manual is the best source of information for recommended maintenance intervals.  Follow the manufacturer\'s recommendations.\n*   **Typical Intervals:** Here\'s a general guideline, but always refer to your owner\'s manual:\n    *   **Every Month:** Check tire pressure, fluid levels (oil, coolant, windshield washer fluid).\n    *   **Every 3 Months or 3,000 Miles (Conventional Oil):** Oil change, check and top off all fluids, inspect tires.  *Note: Many modern vehicles with synthetic oil can go much longer between oil changes.*\n    *   **Every 6 Months or 6,000 Miles (Conventional Oil):** Tire rotation, check brakes, inspect belts and hoses.\n    *   **Every Year or 12,000 Miles:**  Replace air filter, inspect suspension and steering components.\n    *   **Every 2-3 Years:**  Flush and replace brake fluid, replace coolant.\n    *   **As Needed:** Replace spark plugs, replace belts and hoses, replace brake pads/rotors, replace tires.\n\n**IV. Do-It-Yourself (DIY) Maintenance:**\n\nMany maintenance tasks can be done at home with basic tools and some knowledge. Here are some common DIY tasks:\n\n*   **Checking and Topping Off Fluids:**  Easy to do, just make sure you know where the reservoirs are and use the correct fluid type.\n*   **Replacing Air Filter:**  Usually a simple process involving unclipping a housing and swapping the filter.\n*   **Replacing Windshield Wipers:**  Very straightforward.\n*   **Checking and Adjusting Tire Pressure:**  Essential for safety and fuel economy.\n*   **Replacing Light Bulbs:**  Usually a simple process.\n*   **Changing Engine Oil and Filter:** Requires some tools (wrench, oil filter wrench, drain pan) and knowledge of proper disposal of used oil.\n*   **Tire Rotation:** Requires a jack and lug wrench.\n\n**Important Considerations for DIY:**\n\n*   **Safety First:** Always use jack stands when working under a vehicle. Wear safety glasses and gloves.\n*   **Correct Parts:** Use the correct parts for your vehicle.\n*   **Proper Tools:** Use the right tools for the job.\n*   **Disposal:** Dispose of used fluids (oil, coolant, brake fluid) properly.  Most auto parts stores accept used oil for recycling.\n*   **Knowledge:**  Don\'t attempt a repair if you\'re not comfortable or don\'t have the necessary knowledge. Consult a repair manual or online resources.\n*   **Documentation:** Keep records of all maintenance you perform.\n\n**V. When to Seek Professional Help:**\n\nSome maintenance tasks are best left to qualified mechanics.  Consider professional help for:\n\n*   **Complex Repairs:**  Engine repairs, transmission repairs, brake system repairs (especially ABS systems), suspension repairs.\n*   **Diagnostic Work:**  Troubleshooting engine problems, electrical issues, or other complex problems.\n*   **Specialized Tools:**  Some repairs require specialized tools that most people don\'t have.\n*   **Time Constraints:**  If you don\'t have the time or the inclination to do the work yourself.\n*   **Safety Concerns:**  If you\'re not comfortable working on a particular system.\n*   **Warranty Requirements:** Some maintenance or repairs need to be done by a certified mechanic to keep your warranty valid.\n\n**VI. Choosing a Mechanic:**\n\n*   **Ask for Recommendations:**  Get recommendations from friends, family, or online reviews.\n*   **Check Credentials:**  Look for mechanics who are certified by the National Institute for Automotive Service Excellence (ASE).\n*   **Get Estimates:**  Get written estimates from multiple shops before authorizing any work.\n*   **Read Reviews:** Check online review sites to see what other customers have to say.\n*   **Communication:**  Choose a mechanic who communicates clearly and explains the repairs in a way you understand.\n*   **Warranty:**  Ask about the shop\'s warranty on parts and labor.\n\n**VII. Tools and Resources:**\n\n*   **Owner\'s Manual:** The most important resource for your specific vehicle.\n*   **Repair Manuals:** Haynes and Chilton manuals provide detailed instructions for many repairs.\n*   **Online Forums:**  Online forums dedicated to your car model can be a great source of information and advice.\n*   **YouTube:**  Many videos demonstrate how to perform various maintenance tasks.\n*   **Auto Parts Stores:**  Auto parts stores often have helpful staff who can answer questions and provide advice.\n*   **Diagnostic Tools (OBD2 Scanners):**  These tools can read diagnostic codes from your car\'s computer, helping you identify potential problems.\n\n**VIII.  Specific scenarios and examples:**\n\n*   **Scenario 1:  Your car is pulling to one side when braking.**  This could indicate a problem with the brakes (uneven wear, caliper issue) or the suspension/steering (alignment problem).  It\'s best to have this checked by a mechanic.\n*   **Scenario 2:  Your check engine light comes on.**  This could be caused by a wide range of problems.  You can use an OBD2 scanner to read the code, but it\'s often best to have a mechanic diagnose the problem.\n*   **Scenario 3:  Your tires are wearing unevenly.**  This could be caused by improper inflation, misalignment, or worn suspension components.  Have the alignment checked and the suspension inspected.\n*   **Scenario 4: You hear a squealing noise when you brake.** This usually indicates that your brake pads are worn and need to be replaced.\n\n**IX.  Keeping Records:**\n\n*   **Why:**  Having a record of car maintenance helps track what has been done to the vehicle, when maintenance was performed, and whether there are any recurring problems.  It\'s also valuable when selling the car.\n*   **How:**  Keep a file folder with receipts, invoices, and notes about any maintenance or repairs.  You can also use a digital app or spreadsheet to track maintenance.\n\n**In summary, car maintenance is essential for safety, reliability, and longevity. By following a regular maintenance schedule and addressing problems promptly, you can keep your car running smoothly for years to come. Remember to consult your owner\'s manual for specific recommendations for your vehicle.**\n\nI hope this comprehensive overview helps!  Let me know if you have any specific questions or want to delve deeper into a particular area of car maintenance. For example, you might ask:\n\n*   \"How do I change my oil?\"\n*   \"What are the symptoms of a bad water pump?\"\n*   \"How often should I rotate my tires?\"\n*   \"What are the best OBD2 scanners for home use?\"\n', '2025-10-10 22:48:28'),
(14, 2, 'user', 'As a toyota owner, how often should i go for maintenance', '2025-10-10 22:54:57'),
(15, 2, 'assistant', 'Toyota vehicles are known for their reliability, but regular maintenance is still crucial to keep them running smoothly and prevent costly repairs down the road. The ideal maintenance schedule depends on a few factors, including:\n\n*   **Your Driving Habits:**  Are you doing a lot of stop-and-go city driving, or mostly highway miles?  Do you tow or carry heavy loads frequently?  More demanding driving conditions typically warrant more frequent maintenance.\n*   **The Age of Your Vehicle:**  Older vehicles might need certain services more often than newer ones.\n*   **Your Specific Model:**  While Toyota maintenance philosophies are generally consistent, there can be slight variations between models.\n*   **The Type of Maintenance:**  Some things need to be done much more frequently than others.\n\nHowever, here\'s a general guideline:\n\n**1. Consult Your Owner\'s Manual:**\n\n*   **This is the most important step!** Your owner\'s manual contains the manufacturer\'s recommended maintenance schedule specific to your vehicle\'s year, model, and engine.  It will list services based on mileage or time intervals (whichever comes first). It has been designed with the specific needs of the vehicle in mind.\n\n**2. Typical Toyota Maintenance Intervals (General Guidelines):**\n\n*   **Every 6 Months or 5,000 Miles (Whichever Comes First):**\n    *   **Oil and Filter Change:** This is the most frequent and crucial service.  Using the correct type of oil (conventional, synthetic blend, or full synthetic) as specified in your owner\'s manual is important.  Follow the oil change interval recommendation for your driving conditions.\n    *   **Tire Rotation:** Rotating your tires helps them wear evenly, extending their lifespan.\n    *   **Multi-Point Inspection:**  A basic inspection of fluid levels, brakes, lights, hoses, belts, and other components.  Many shops include this with an oil change.\n    *   **Check and Top Off Fluids:**  Windshield washer fluid, coolant, power steering fluid, brake fluid.\n\n*   **Every 12 Months or 10,000-15,000 Miles (Whichever Comes First):**\n    *   **All of the above (from 6-month/5,000-mile service)**\n    *   **Cabin Air Filter Replacement:**  Keeps the air inside your car clean.  Replace more frequently if you drive in dusty or polluted areas.\n    *   **Engine Air Filter Replacement:**  Keeps the air entering your engine clean. Replace more frequently if you drive in dusty conditions.\n    *   **Visual Inspection of Brakes:** Check brake pad thickness and rotor condition.\n\n*   **Every 30,000 Miles:**\n    *   **All of the above (from previous services)**\n    *   **Automatic Transmission Fluid Change (Inspect/Replace)** Some models require inspection and/or replacement. Consult your owner\'s manual or a trusted mechanic.\n    *   **Power Steering Fluid Change (Inspect/Replace)** Refer to owner\'s manual.\n    *   **Brake Fluid Flush:**  Replaces old brake fluid, which can absorb moisture and reduce braking performance.\n    *   **Inspect Hoses and Belts:**  Look for cracks, wear, and damage.\n\n*   **Every 60,000 Miles:**\n    *   **All of the above (from previous services)**\n    *   **Spark Plug Replacement:**  For most Toyota engines. Check your owner\'s manual for specific recommendations.\n    *   **Coolant Flush:**  Replaces old coolant to prevent corrosion and maintain optimal engine temperature.\n\n*   **Every 90,000 - 100,000 Miles:**\n    *   **Timing Belt Replacement (If Applicable):** Some older Toyotas use timing belts, which need to be replaced at this interval to prevent catastrophic engine damage if they break.  Many newer Toyotas use timing chains, which are designed to last the life of the engine.  Check your owner\'s manual to see if your vehicle has a timing belt or chain.\n\n**3. Important Considerations:**\n\n*   **\"Severe\" Driving Conditions:** If you regularly drive in severe conditions (stop-and-go traffic, extreme temperatures, dusty roads, towing), you may need to shorten the maintenance intervals for certain services, especially oil changes and filter replacements. Refer to your owner\'s manual for specific recommendations.\n*   **Warning Lights:** Pay attention to any warning lights that come on in your dashboard. These lights indicate that there may be a problem that needs attention.\n*   **Professional Inspection:**  Even if you\'re diligent about following the maintenance schedule, it\'s a good idea to have your vehicle inspected by a qualified mechanic at least once a year. They can identify potential problems before they become major issues.\n*   **Keep Records:**  Maintain a record of all maintenance performed on your vehicle. This will help you track when services are due and can also be helpful if you ever decide to sell your car.\n\n**4. Where to Get Maintenance:**\n\n*   **Toyota Dealership:** Dealerships have factory-trained technicians who are familiar with your vehicle. They typically use genuine Toyota parts.  However, they can sometimes be more expensive than independent shops.\n*   **Independent Repair Shop:**  Independent shops can often offer competitive prices.  Look for a shop with good reviews and experienced mechanics.\n*   **Do-It-Yourself (DIY):**  If you\'re mechanically inclined, you can perform some maintenance tasks yourself, such as oil changes and filter replacements. However, be sure to follow the instructions carefully and use the correct parts and fluids.\n\n**In summary:** Consult your owner\'s manual first and foremost. Then, consider your driving habits and the age of your vehicle to determine the appropriate maintenance schedule. Regular maintenance is a wise investment that will help keep your Toyota running reliably for years to come.\n', '2025-10-10 22:55:06'),
(17, 2, 'user', 'How do i know its time for a routine checkup', '2025-10-11 15:07:36'),
(18, 2, 'assistant', 'The best time for a routine checkup depends on several factors, including your age, health history, lifestyle, and any specific recommendations from your doctor. Here\'s a general guideline and key considerations:\n\n**General Recommendations:**\n\n*   **Adults (18-39 years old):** Generally, a checkup every 1-3 years is recommended if you\'re healthy and have no specific concerns.  Young adults should establish a relationship with a primary care physician and discuss preventive health.\n\n*   **Adults (40-64 years old):** As you get older, annual checkups become more important. Certain risk factors for diseases, such as high blood pressure, cholesterol, and diabetes, increase with age. Annual checkups allow your doctor to monitor these factors and make necessary lifestyle or medical recommendations.\n\n*   **Adults (65 years and older):** Annual checkups are highly recommended, and some individuals may benefit from more frequent visits. Older adults are more susceptible to chronic conditions and benefit from proactive health monitoring and management.\n\n**Key Considerations to Determine When to Schedule a Checkup:**\n\n1.  **Age:** As mentioned above, age is a significant factor.  Babies and young children need frequent checkups, which become less frequent as you get older until middle age, and then generally increase in frequency again.\n\n2.  **Existing Medical Conditions:** If you have any chronic conditions like diabetes, heart disease, asthma, or high blood pressure, you\'ll likely need more frequent checkups to manage your condition effectively. Your doctor will advise you on the appropriate schedule.\n\n3.  **Family History:** A strong family history of certain diseases (e.g., heart disease, cancer, diabetes) may warrant more frequent screenings and checkups. Discuss your family history with your doctor to determine the best screening schedule for you.\n\n4.  **Lifestyle Factors:**\n    *   **Smoking:** Smokers need regular checkups to monitor their lung health and assess risks for smoking-related illnesses.\n    *   **Diet and Exercise:** An unhealthy diet and lack of exercise can increase your risk of several health problems.  Regular checkups can help you identify areas for improvement and receive guidance on healthy lifestyle changes.\n    *   **Alcohol Consumption:** Excessive alcohol use can damage your liver and increase your risk of other health problems.\n    *   **Stress:** High stress levels can negatively affect your health. Regular checkups can help you manage stress and identify potential health problems.\n\n5.  **Medications:** If you are taking any medications, especially for chronic conditions, you may need more frequent checkups to monitor their effectiveness and potential side effects.\n\n6.  **New or Worsening Symptoms:** Don\'t wait for your routine checkup if you experience any new or concerning symptoms. These could include:\n    *   Unexplained weight loss or gain\n    *   Persistent fatigue\n    *   Changes in bowel habits\n    *   Unusual lumps or bumps\n    *   Persistent pain\n    *   Vision changes\n    *   Breathing difficulties\n    *   Chest pain\n    *   Severe headaches\n\n7.  **Screenings:**  Certain screenings are recommended at specific ages, such as mammograms, Pap smears, colonoscopies, prostate exams, bone density scans, and cholesterol checks.  Your doctor can advise you on the appropriate screening schedule based on your age, sex, and risk factors.\n\n8.  **Doctor\'s Recommendations:**  Always follow your doctor\'s personalized recommendations for checkups. They know your individual health history and can advise you on the best schedule for your needs.\n\n**How to Determine Your Specific Needs:**\n\n1.  **Review Your Medical History:** Consider your past health problems, medications, and family history.\n2.  **Assess Your Lifestyle:** Evaluate your diet, exercise habits, smoking status, alcohol consumption, and stress levels.\n3.  **Consider Your Age and Sex:**  Different age groups and sexes have different screening recommendations.\n4.  **Talk to Your Doctor:** The best way to determine the right checkup schedule for you is to talk to your doctor. They can assess your individual risk factors and recommend the most appropriate screening and prevention schedule.\n\n**In Summary:**\n\nThere\'s no one-size-fits-all answer to how often you need a checkup. The frequency depends on your individual health status and risk factors. If you\'re generally healthy and under 40, a checkup every 1-3 years might be sufficient. However, if you have any chronic conditions, risk factors, or new symptoms, you should see your doctor more frequently. Always consult with your doctor to determine the best checkup schedule for your specific needs.  Don\'t hesitate to schedule an appointment if you have any concerns, even if it\'s not time for your regularly scheduled checkup. Early detection and prevention are key to maintaining good health.\n', '2025-10-11 15:07:45'),
(19, 2, 'user', 'I meant routine checkup for my vehicle', '2025-10-11 15:08:47'),
(20, 2, 'assistant', 'Okay, I understand. You\'re looking for information about a routine checkup for your vehicle. To give you the best information, I need a little more detail. Could you tell me:\n\n*   **What kind of vehicle do you have?** (Make, model, and year are helpful)\n*   **Do you have an idea of what you want to have checked/inspected?** (e.g., just a basic safety check, or something more comprehensive?)\n*   **Are you looking to DIY (Do It Yourself) or take it to a professional?**\n*   **Where are you located?** (This helps me find local shops and provide price estimates)\n\nIn the meantime, here\'s a general overview of what a routine vehicle checkup usually involves:\n\n**Typical Items Included in a Routine Vehicle Checkup:**\n\n*   **Fluid Levels:**\n    *   Engine oil\n    *   Coolant (antifreeze)\n    *   Brake fluid\n    *   Power steering fluid\n    *   Windshield washer fluid\n    *   Transmission fluid (may or may not be checked depending on the type of transmission)\n*   **Filters:**\n    *   Engine air filter\n    *   Cabin air filter (if equipped)\n    *   Fuel filter (may or may not be checked/replaced)\n*   **Lights:**\n    *   Headlights (high and low beams)\n    *   Taillights\n    *   Brake lights\n    *   Turn signals (front and rear)\n    *   Parking lights\n    *   Hazard lights\n    *   Interior lights\n*   **Tires:**\n    *   Tire pressure\n    *   Tread depth\n    *   Visual inspection for wear and damage\n*   **Brakes:**\n    *   Visual inspection of brake pads/shoes, rotors/drums, and brake lines\n*   **Battery:**\n    *   Battery condition (voltage and load test)\n    *   Terminal connections\n*   **Belts and Hoses:**\n    *   Visual inspection for cracks, wear, and leaks\n*   **Suspension and Steering:**\n    *   Visual inspection of shocks/struts, ball joints, tie rod ends, and steering components\n*   **Exhaust System:**\n    *   Visual inspection for leaks, damage, and corrosion\n*   **Wipers:**\n    *   Condition of wiper blades\n*   **Diagnostics:**\n    *   Scanning the vehicle\'s computer for any stored error codes (check engine light)\n\n**DIY vs. Professional:**\n\n*   **DIY:** If you\'re comfortable with basic car maintenance, you can check some of these items yourself (like fluid levels, lights, tire pressure, and wipers). You\'ll need some basic tools.\n*   **Professional:** A mechanic can perform a more thorough inspection and has the equipment to diagnose more complex issues.\n\n**Frequency:**\n\n*   Most manufacturers recommend a routine checkup every 6 months or 6,000 miles, or as specified in your owner\'s manual.\n\nOnce you provide me with some more information, I can give you a more tailored and helpful response!', '2025-10-11 15:08:52'),
(21, 2, 'user', 'Make: Toyota, Year: 2023: model: Highlander', '2025-10-11 15:09:32'),
(22, 2, 'assistant', 'Okay, you\'re providing information about a vehicle. Here\'s that information in a more structured way:\n\n*   **Make:** Toyota\n*   **Year:** 2023\n*   **Model:** Highlander\n\nIs there anything else you\'d like to know or any other way I can help you with this information? Perhaps you want to know about:\n\n*   **Common issues with the 2023 Highlander?**\n*   **Fuel economy?**\n*   **Trim levels?**\n*   **Reviews?**\n*   **Pricing?**\n*   **Competitors?**\n', '2025-10-11 15:09:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `account_status` enum('Active','Inactive') NOT NULL DEFAULT 'Inactive',
  `otp` int(4) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Car Owner') NOT NULL DEFAULT 'Car Owner',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `gender`, `phone`, `email`, `password`, `address`, `account_status`, `otp`, `salt`, `role`, `created_at`) VALUES
(2, 'Uchechukwu', 'Udo', 'Male', '08065198300', 'udoigweuchechukwu@gmail.com', 'Scott1379..', 'FCT,  Nigeria', 'Active', NULL, NULL, 'Car Owner', '2025-10-01 11:18:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alerts_and_reminders`
--
ALTER TABLE `alerts_and_reminders`
  ADD PRIMARY KEY (`reminder_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`car_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `knowledge_hub_chats`
--
ALTER TABLE `knowledge_hub_chats`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alerts_and_reminders`
--
ALTER TABLE `alerts_and_reminders`
  MODIFY `reminder_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `car_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `knowledge_hub_chats`
--
ALTER TABLE `knowledge_hub_chats`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
