import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  ChatMessage,
  ChatCompletionOptions,
  ChatResponse,
  MultiPromptRequest,
} from './interfaces/openai.interface';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });

    this.logger.log('OpenAI client initialized successfully');
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
      const defaultOptions = {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 1,
      };

      const finalOptions = { ...defaultOptions, ...options };

      const completion = await this.openai.chat.completions.create({
        model: finalOptions.model,
        messages: messages,
        temperature: finalOptions.temperature,
        max_tokens: finalOptions.maxTokens,
        top_p: finalOptions.topP,
      });

      const response: ChatResponse = {
        content: completion.choices[0]?.message?.content || '',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      };

      this.logger.log(
        `OpenAI API call completed. Tokens used: ${response.usage.totalTokens}`,
      );

      return response;
    } catch (error) {
      this.logger.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
}
