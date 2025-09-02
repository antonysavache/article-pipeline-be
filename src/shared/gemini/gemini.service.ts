import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ChatMessage,
  ChatCompletionOptions,
  ChatResponse,
  MultiPromptRequest,
} from '../openai/interfaces/openai.interface';
import { PipelineConfigService } from '../pipeline/pipeline-config.service';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly pipelineConfigService: PipelineConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.logger.log('Gemini client initialized successfully');
  }

  /**
   * Генерировать статью на основе pipeline данных
   */
  async generateFromPipeline(
    task: string,
    options?: ChatCompletionOptions,
  ): Promise<ChatResponse> {
    try {
      const countryInfo = this.pipelineConfigService.getCountryInfo();
      const skeleton = this.pipelineConfigService.getSkeleton();

      // Формируем системный промпт с информацией из pipeline
      const systemPromptParts: string[] = [];

      if (countryInfo) {
        systemPromptParts.push(`ИНФОРМАЦИЯ О СТРАНЕ:\n${countryInfo}`);
      }

      if (skeleton) {
        systemPromptParts.push(`СТРУКТУРА СТАТЬИ:\n${skeleton}`);
      }

      const finalSystemPrompt = systemPromptParts.join('\n\n');

      this.logger.log(
        'Pipeline system prompt created with parts:',
        systemPromptParts.length,
      );

      const messages: ChatMessage[] = [
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: task },
      ];

      return await this.chatWithMessages(messages, options);
    } catch (error) {
      this.logger.error('Error in generateFromPipeline method:', error);
      throw error;
    }
  }

  /**
   * Отправить запрос с комбинацией промптов (мастер + модуль + задача)
   */
  async chatWithMultiplePrompts(
    request: MultiPromptRequest,
    options?: ChatCompletionOptions,
  ): Promise<ChatResponse> {
    try {
      // Собираем системный промпт из всех частей
      const systemPromptParts: string[] = [];

      if (request.masterPrompt) {
        systemPromptParts.push(`MASTER PROMPT:\n${request.masterPrompt}`);
      }

      if (request.modulePrompt) {
        systemPromptParts.push(`MODULE PROMPT:\n${request.modulePrompt}`);
      }

      const finalSystemPrompt = systemPromptParts.join('\n\n');

      this.logger.log(
        'Combined system prompt created with parts:',
        systemPromptParts.length,
      );

      const messages: ChatMessage[] = [
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: request.userTask },
      ];

      return await this.chatWithMessages(messages, options);
    } catch (error) {
      this.logger.error('Error in chatWithMultiplePrompts method:', error);
      throw error;
    }
  }

  private async chatWithMessages(
    messages: ChatMessage[],
    options?: ChatCompletionOptions,
  ): Promise<ChatResponse> {
    try {
      // Gemini использует gemini-1.5-flash по умолчанию
      const model = this.genAI.getGenerativeModel({ 
        model: options?.model || 'gemini-1.5-flash' 
      });

      // Объединяем системное сообщение и пользовательское
      let finalPrompt = '';
      
      const systemMessage = messages.find(msg => msg.role === 'system');
      const userMessage = messages.find(msg => msg.role === 'user');
      
      if (systemMessage) {
        finalPrompt += `SYSTEM INSTRUCTIONS:\n${systemMessage.content}\n\n`;
      }
      
      if (userMessage) {
        finalPrompt += `USER REQUEST:\n${userMessage.content}`;
      }

      this.logger.log('Sending request to Gemini API');

      const result = await model.generateContent(finalPrompt);
      const response = await result.response;
      const text = response.text();

      const chatResponse: ChatResponse = {
        content: text,
        usage: {
          promptTokens: 0, // Gemini не возвращает детальную информацию об использовании токенов
          completionTokens: 0,
          totalTokens: 0,
        },
      };

      this.logger.log('Gemini API call completed successfully');

      return chatResponse;
    } catch (error) {
      this.logger.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}
