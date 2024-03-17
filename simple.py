import openai

openai.api_key = "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"  

def chat(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    
