const express = require('express');
const router = express.Router();
const driver = require('../db');

router.get('/', async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)
      RETURN e.name AS employee, collect(s.name) AS skills
    `);

    const data = result.records.map((r) => ({
      employee: r.get('employee'),
      skills: r.get('skills'),
    }));

    res.json(data);
  } catch (err) {
    console.error('Failed to fetch employees:', err);

    res.status(500).json({
      error: 'Failed to fetch employees. Please try again later.',
    });
  } finally {
    await session.close();
  }
});

router.get('/:name/extended-network', async (req, res) => {
  const { name } = req.params;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      error: 'Employee name is required.',
    });
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (me:Employee {name: $myName})-[:WORKS_ON]->(:Project)<-[:WORKS_ON]-(colleague:Employee)
      WHERE colleague <> me

      MATCH (colleague)-[:WORKS_ON]->(:Project)<-[:WORKS_ON]-(colOfCol:Employee)
      WHERE colOfCol <> me AND colOfCol <> colleague

      MATCH (me)-[:HAS_SKILL]->(sharedSkill:Skill)<-[:HAS_SKILL]-(colOfCol)

      RETURN DISTINCT
        colOfCol.name AS person,
        collect(DISTINCT sharedSkill.name) AS sharedSkills
      `,
      {
        myName: name,
      }
    );
    if (result.records.length === 0) {
      return res.json([]);
    }

    const data = result.records.map((r) => ({
      person: r.get('person'),
      sharedSkills: r.get('sharedSkills'),
    }));

    res.json(data);

  } catch (err) {
    console.error('Failed to fetch extended network:', err);

    res.status(500).json({
      error: 'Failed to fetch network. Please try again later.',
    });

  } finally {
    await session.close();
  }
});

module.exports = router;