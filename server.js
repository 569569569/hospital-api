require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// AI 问答接口
app.post('/ai/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: '请输入问题' });
  }

  try {
    const dashRes = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: 'qwen-plus',
        input: {
          prompt: question,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      answer: dashRes.data.output.text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI 调用失败' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});