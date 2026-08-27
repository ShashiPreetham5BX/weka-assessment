   const driver = require('../backend/db');

   const employees = [
     { name: 'Preetham', title: 'Backend Engineer', department: 'Engineering' },
     { name: 'Pratyusha', title: 'Frontend Engineer', department: 'Engineering' },
     { name: 'Mokshitha', title: 'Data Scientist', department: 'Data' },
     { name: 'Eiffel', title: 'Backend Engineer', department: 'Engineering' },
     { name: 'Deepanshu', title: 'Product Manager', department: 'Product' },
     { name: 'Vallabha', title: 'DevOps Engineer', department: 'Engineering' },
     { name: 'Saketh', title: 'UX Designer', department: 'Design' },
     { name: 'Viswas', title: 'Data Engineer', department: 'Data' },
   ];

   const skills = ['Python', 'React', 'SQL', 'Kubernetes', 'Figma', 'Machine Learning'];

   const projects = [
     { title: 'Checkout Revamp', status: 'active' },
     { title: 'Recommendation Engine', status: 'active' },
     { title: 'Internal Dashboard', status: 'completed' },
   ];

   const hasSkill = [
     ['Preetham', 'Python'], ['Preetham', 'SQL'],
     ['Pratyusha', 'React'], ['Pratyusha', 'Python'],
     ['Mokshitha', 'Python'], ['Mokshitha', 'Machine Learning'], ['Mokshitha', 'SQL'],
     ['Eiffel', 'Python'], ['Eiffel', 'Kubernetes'],
     ['Deepanshu', 'SQL'],
     ['Vallabha', 'Kubernetes'],
     ['Saketh', 'Figma'], ['Saketh', 'React'],
     ['Viswas', 'SQL'], ['Viswas', 'Python'],
   ];

   const worksOn = [
     ['Preetham', 'Checkout Revamp'], ['Pratyusha', 'Checkout Revamp'], ['Mokshitha', 'Checkout Revamp'],
     ['Eiffel', 'Recommendation Engine'], ['Deepanshu', 'Recommendation Engine'], ['Vallabha', 'Recommendation Engine'],
     ['Saketh', 'Internal Dashboard'], ['Viswas', 'Internal Dashboard'], ['Mokshitha', 'Internal Dashboard'],
     ['Viswas', 'Checkout Revamp'],
   ];

   async function seed() {
     const session = driver.session();
     try {
       await session.run('MATCH (n) DETACH DELETE n');

       for (const e of employees) {
         await session.run(
           'CREATE (:Employee {name: $name, title: $title, department: $department})',
           e
         );
       }

       for (const s of skills) {
         await session.run('CREATE (:Skill {name: $name})', { name: s });
       }

       for (const p of projects) {
         await session.run(
           'CREATE (:Project {title: $title, status: $status})',
           p
         );
       }

       for (const [emp, skill] of hasSkill) {
         await session.run(
           `MATCH (e:Employee {name: $emp}), (s:Skill {name: $skill})
            CREATE (e)-[:HAS_SKILL]->(s)`,
           { emp, skill }
         );
       }
       for (const [emp, proj] of worksOn) {
         await session.run(
           `MATCH (e:Employee {name: $emp}), (p:Project {title: $proj})
            CREATE (e)-[:WORKS_ON]->(p)`,
           { emp, proj }
         );
       }

       console.log('Seed data loaded successfully!');
     } catch (err) {
       console.error('Seeding failed:', err.message);
     } finally {
       await session.close();
       await driver.close();
     }
   }

   seed();