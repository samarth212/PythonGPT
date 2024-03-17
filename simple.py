import openai

openai.api_key = "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"  

completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Give me 3 ideas for apps I could build with openai apis "}])
print(completion.choices[0].message.content)