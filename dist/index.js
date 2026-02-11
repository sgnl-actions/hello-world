/**
 * @license MIT
 * Copyright (c) 2025 SGNL.ai, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";var e={invoke:async(e,o)=>{console.log("Starting hello world job execution");const{first_name:r,last_name:n,language:a}=e;if(!r)throw new Error("Missing required parameter: first_name");if(!n)throw new Error("Missing required parameter: last_name");const l={en:"Hello World",es:"Hola Mundo",fr:"Bonjour le Monde",de:"Hallo Welt",it:"Ciao Mondo",pt:"Olá Mundo",ja:"こんにちは世界",zh:"你好世界",ru:"Привет мир",ar:"مرحبا بالعالم"};if(a&&!l[a])throw new Error(`Unsupported language: ${a}`);let s=a;if(!s){const e=Object.keys(l);s=e[Math.floor(Math.random()*e.length)],console.log(`No language specified, randomly selected: ${s}`)}console.log(`Creating greeting in ${s} for ${r} ${n}`);const t=`${l[s]}, ${r} ${n}!`;return console.log(`Generated message: ${t}`),{message:t,language:s,processed_at:(new Date).toISOString()}},error:async e=>{const{error:o,first_name:r,last_name:n}=e;if(console.error(`Hello world job encountered error for ${r} ${n}: ${o.message}`),o.message.includes("language")||o.message.includes("greeting"))return console.log("Language error detected - falling back to English"),{message:`Hello World, ${r} ${n}!`,language:"en",processed_at:(new Date).toISOString()};throw console.error(`Unable to recover from error for ${r} ${n}`),new Error(`Unrecoverable error creating greeting: ${o.message}`)},halt:async e=>{const{reason:o,first_name:r,last_name:n}=e;console.log(`Hello world job is being halted (${o}) for ${r} ${n}`),console.log("Performing minimal cleanup operations")}};module.exports=e;
