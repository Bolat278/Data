# Ақпаратпен жұмыс / Работа с информацией

## AI Chatbot - Tair bot

Чат-бот интегрирован с **Wikipedia API** для получения реальной информации:

### Возможности:
- 🔍 Поиск информации на казахском и русском языках
- 📚 Автоматический поиск в Википедии
- 🌐 Ссылки на полные статьи
- ⚡ Быстрые ответы
- 🎯 Работает без API ключей

### Как использовать:
1. Нажмите на кнопку с иконкой робота в правом нижнем углу
2. Задайте любой вопрос на казахском или русском
3. Получите ответ из Википедии

### Примеры запросов:
- "Казахстан"
- "Информация"
- "Алматы"
- "Криптография"
- "База данных"

## Опционально: ChatGPT Integration

Если хотите использовать ChatGPT вместо Wikipedia:

1. Получите API ключ на https://platform.openai.com/api-keys
2. Замените функцию `generateResponse` в `script.js`:

```javascript
async function generateResponse(message) {
    const apiKey = 'YOUR_OPENAI_API_KEY_HERE';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Ты - полезный ассистент Tair bot. Отвечай на казахском или русском.' },
                { role: 'user', content: message }
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}
```

## Деплой на Vercel

1. Зайдите на https://vercel.com
2. Нажмите "Add New Project"
3. Загрузите папку `website`
4. Нажмите "Deploy"
