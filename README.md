                                TalkSport

TalkSport is a web application designed for football enthusiasts and aspiring footballers to connect, share opinions, and showcase their talents. The platform aims to foster a global football community where individuals can voice their perspectives about the sport while providing young talents with an opportunity to gain visibility and increase their chances of being scouted by professional football clubs.

Features
Community Engagement: Football fans can share opinions, insights, and discuss their favorite sport with like-minded individuals.
Talent Showcase: Aspiring footballers can upload videos and pictures showcasing their skills, making it easier to get noticed by scouts and clubs.
Interactive Dashboard: A personalized dashboard where users can view, like, and interact with content posted by others.
Dynamic Content Upload: Users can upload media (photos/videos) and add captions to share with the community.

Technologies Used

Frontend:
React and Next.js (for building a dynamic and responsive user interface).
TypeScript (to ensure type safety and scalability).
Tailwind CSS (for responsive and elegant design).

Backend:
Prisma ORM (for data modeling and database queries).
PostgreSQL (as the database for storing user and content data).

Version Control:
GitHub (for version control and project collaboration).
Setup Instructions
Prerequisites
Node.js installed on your machine.
PostgreSQL database set up locally or remotely.
Basic knowledge of terminal commands.
Installation Steps
Clone the Repository:



git clone https://github.com/your-username/talksport.git
cd talksport
Install Dependencies:



npm install
Set Up Environment Variables:

Create a .env file in the project root.
Add the following variables:
env

DATABASE_URL="postgresql://user:password@localhost:5432/talksport"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
Set Up the Database:

Generate Prisma Client:
npx prisma generate
Apply migrations to set up the database schema:

npx prisma migrate dev --name init
Run the Development Server:

npm run dev
Access the Application:

Open your browser and navigate to:

http://localhost:3000

How to Use
Sign Up:
Create an account on the platform.
Upload Content:
Share videos or pictures showcasing your football skills.
Engage with the Community:
Like and interact with posts shared by others.
Notifications:
Keep track of likes and interactions on your content.





                Checklist for Project Tasks:
Planering och Research
 
 Utföra en noggrann målgruppsanalys.(klart)
 Använda ett projekthanteringsverktyg för backlog, till exempel Trello eller Kanban, för att strukturera arbetet.(klart)

Design och Prototyping

 Skapa wireframes och prototyp i Figma som följer UX/UI-principer.(klart)
 Se till att designen är responsiv för minst två olika skärmstorlekar och följer WCAG 2.1-standarder.(klart)

Applikationsutveckling
 Utveckla med ett modernt JavaScript-ramverk.(klart)
 Använd en databas för lagring och hämtning av data.(klart)
 Implementera state-hantering och skapa dynamiska komponenter med reaktivitet och interaktivitet. (klart)
 Följa WCAG 2.1-standarder och använda semantisk HTML. (klart)
 För webbapp: Produkten ska vara responsiv och fungera korrekt på minst två skärmstorlekar, till exempel mobil och dator. Gränssnittet ska anpassa sig för att ge en användarvänlig upplevelse på båda dessa enheter.(klart)
 För native mobilapp: Produkten ska anpassas till olika skärmstorlekar och enhetsorienteringar (porträtt och landskap). Gränssnittet ska fungera sömlöst på flera mobila enheter, som smartphones och surfplattor, med korrekt layout, skalning och användarvänlighet oavsett skärmstorlek.(klart)

Versionshantering
 Arbeta med Git och ha ett repo på GitHub.(klart)

Slutrapport
 Abstract på engelska.(klart)
 Tech stack och motivering av valen.(klart)
 Dokumentation av arbetsprocess, planering och research.(klart)

Deploy
 Ditt projekt ska vara hostat och tillgängligt för att kunna visas i en webbläsare eller simulator.(klart)
