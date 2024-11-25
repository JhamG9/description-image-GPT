import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import OpenAI from "openai";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'responses-images';
  openai = new OpenAI({
    apiKey: 'API_KEY',
    dangerouslyAllowBrowser: true
  });
  prompt = 'Genera un título en inglés describiendo lo que hay en la imagen adjunta, con una extensión máxima de 200 caracteres para Shutterstock y Adobe Stock. La ubicación del lugar es: Pueblito boyacense, Duitama, Boyaca. Proporciona exactamente 50 palabras clave en inglés en un solo párrafo, separadas por comas, sin tildes y todas en minúsculas. Usa las siguientes palabras clave y asegúrate de que cada una esté separada por comas, incluso las que tu agregues: historical, colonial, colonial house, colombian architecture, vacation, landmark, ancient, colombian, colombian art, decorated, tourist attraction, touristic, boyacá, colombia, boyaca colombia, duitama boyaca, duitama, boyaca town, little town boyacense, boyacense town, pueblo boyaca, pueblito boyacense, pueblo boyacense, historic, traditional, culture, architecture, travel. Busca imágenes relacionadas a la imagen en la web para mejorar las palabras clave para Shutterstock y Adobe Stock. Usa palabras sencillas y fáciles de leer. Asegúrate de que todas las palabras clave estén separadas por comas y si es necesario agrega palabras para completar las 50 palabras claves. En el titulo usa Litle town Boyacense en lugar de Pueblito Boyacense. Tómate tu tiempo en hacerlo y asegúrate de que la respuesta sea precisa y exacta';
  promptEditorial = '';
  
  ngOnInit(): void {
    this.analyzeImages();
  }

  async convertImageToBase64(imagePath: string): Promise<string> {
    const response = await fetch(imagePath); // Usar fetch para cargar la imagen local
    const blob = await response.blob(); // Convertir a Blob
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Convertir el Blob a Base64
    });
  }

  async analyzeImages() {
    // for(let image of ArrayImages){      
    //   const imagePath = `images/${image}`;
    //   try {
    //     const base64Image = await this.convertImageToBase64(imagePath);
    //     const completion:any = await this.openai.chat.completions.create({
    //     model: 'gpt-4o-mini',
    //     messages: [
    //       {
    //         "role": "user",
    //         "content": [
    //             {"type": "text", "text": "dsfdsf"},
    //             {
    //               "type": "image_url",
    //               "image_url": { url: base64Image }
    //             },
    //           ],
    //         }
    //       ],
    //     });
    //   // console.log(completion.choices[0].message.content);
    //   } catch (error) {
    //     console.error('Error analizando la imagen:', error);
    //   }
    // }
  }
}
