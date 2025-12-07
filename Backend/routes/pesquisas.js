const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../database/db");

// GET /pesquisas/andamento
router.get("/andamento", auth, async (req, res) => {
  try {
    const pesquisas = await db.all(`
      SELECT 
        p.id,
        p.titulo,
        p.criada_em as criadaEm,
        p.modelo_id as modeloId,
        COUNT(DISTINCT d.id) as totalDestinatarios,
        COUNT(DISTINCT r.id) as totalRespostas,
        CASE 
          WHEN COUNT(DISTINCT d.id) > 0 
          THEN ROUND((COUNT(DISTINCT r.id) * 100.0) / COUNT(DISTINCT d.id))
          ELSE 0 
        END as progresso
      FROM pesquisas p
      LEFT JOIN destinatarios d ON d.pesquisa_id = p.id
      LEFT JOIN respostas r ON r.pesquisa_id = p.id
      WHERE p.status = 'andamento'
      GROUP BY p.id
      ORDER BY p.criada_em DESC
    `);

    res.json(pesquisas);
  } catch (error) {
    console.error("Erro ao buscar pesquisas:", error);
    res.status(500).json({ error: "Erro ao buscar pesquisas" });
  }
});

module.exports = router;