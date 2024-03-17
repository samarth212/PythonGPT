import openai
from openai import OpenAI

client = OpenAI(
    api_key = "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"
    
    )

def chat(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break

        response = chat(user_input)
        print("Chatbot: ", response)
    
