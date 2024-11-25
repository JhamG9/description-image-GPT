import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import OpenAI from "openai";
import { ArrayImages } from '../data/ImagesData';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'responses-images';
  openai = new OpenAI({
    apiKey: 'API_KEY',
    dangerouslyAllowBrowser: true
  });
  prompt = 'Genera un título en inglés describiendo lo que hay en la imagen adjunta, con una extensión máxima de 200 caracteres para Shutterstock y Adobe Stock. La ubicación del lugar es: Bogotá, Colombia. Proporciona exactamente 50 palabras clave en inglés en un solo párrafo, separadas por comas, sin tildes y todas en minúsculas. Usa las siguientes palabras clave y asegúrate de que cada una esté separada por comas, incluso las que tu agregues: modern architecture, bogota city, bogota colombia, bogota, colombia, colombian culture, iconic buildings, city squares, street photography, commercial, building, district capital, bogota architecture, aerial landscape, landmark, capital, south america, modern, tourism, business, outdoors, architecture, urban, travel, landscape, city center, cityscape, buildings, travel. Busca imágenes relacionadas a la imagen en la web para mejorar las palabras clave para Shutterstock y Adobe Stock. Usa palabras sencillas y fáciles de leer. Asegúrate de que todas las palabras clave estén separadas por comas y si es necesario agrega palabras para completar las 50 palabras claves. Tómate tu tiempo en hacerlo y asegúrate de que la respuesta sea precisa y exacta';
  promptEditorial = '';
  listImages: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.analyzeImages();
    this.getImages();
  }

  getImages() {
    this.http.get('http://localhost:3000/photos').subscribe((resp: any) => {
      this.listImages = resp;
      console.log(this.listImages);
    })
  }

  saveImage(body: any) {
    this.http.post('http://localhost:3000/photos', { ...body }, {
      headers: {
        'Accept': 'application/json'
      }
    }).subscribe((resp: any) => {
      console.log(resp);
    });
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

  async saveImageDescription(image: any, imagePath: any) {
    const base64Image = await this.convertImageToBase64(imagePath);
    const completion: any = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          "role": "user",
          "content": [
            { "type": "text", "text": this.prompt },
            {
              "type": "image_url",
              "image_url": { url: base64Image }
            },
          ],
        }
      ],
    });

    const dataResponse = completion.choices[0].message.content;
    // Extraer el título
    const titleMatch = dataResponse.match(/(?<=\*\*Title:\*\*).+/);
    const title = titleMatch ? titleMatch[0].trim() : "";

    // Extraer las keywords
    const keywordsMatch = dataResponse.match(/(?<=\*\*Keywords:\*\*).+/);
    const keywords = keywordsMatch ? keywordsMatch[0].trim() : "";
    this.saveImage({ name: image, description: title, keywords });
    console.log(title);
  }

  async analyzeImages() {
    for (let image of ArrayImages) {
      const imagePath = `images/${image}`;
      try {
        // verificar imagen ya consultada
        this.http.get(`http://localhost:3000/photos/search?name=${image}`).subscribe((resp: any) => {
          if (resp.length === 0) {
            this.saveImageDescription(image, imagePath);
          }
        });
        console.log(image);
      } catch (error) {
        console.error('Error analizando la imagen:', error);
      }
    }
  }

  copyValue(value:string) {
    value = value.replace(/\.$/, '');
    navigator.clipboard.writeText(value);
  }

  soldPhoto(id: string) {
    this.http.put(`http://localhost:3000/photos/sold/${id}`, null).subscribe((resp:any) =>{
      console.log(resp);
      this.getImages();
    })
  }
}
