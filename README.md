# OpenSearch-AI
OpenSearch AI is a tool that allows you to search the internet, this tool is able to launch a query and explore the web by retrieving the content of the sites.

OpenSearch AI is an open source project built in Node JS as a web API, allowing you to explore the web, scraping the contents of sites and extracting only part of it, this tool is very essential especially in the context of generative AI, the case of ChatGPT, DeepSeek, Claude, EdithAI, PalmAI and as well as several AI and chatbot that use this kind of tools to bring out information in real time. Misuse of this tool may be illegal in some countries, training AI models via data output via this tool may also be illegal, make sure to use this tool only for learning and experimentation.

Before you start make sure you have a local Node.JS server or else you can download it from this site: https://nodejs.org/en Once Node.js is installed, please check its installation:

```bash 
$ node -v 
``` 

Check Node Package Management: 

```bash 
$ npm -v 
``` 

These two commands should give you the versions, or else you need to check your installation. 

Once Node.Js is installed, please clone or download the project: 

```bash 
$ git clone https://github.com 
``` 

Once the project is downloaded, please install the necessary packages for operation.

```bash 
$ npm install -g express cheerio axios
``` 

Once installed, we will launch the server: 
```bash 
$ node index.js 
``` 

Once launched, you can use the API locally from your browser.

The API has 3 parameters: 

```[key]```: *To launch the search on the web*

```[url]```: To add a URL as a parameter at the end so that this URL is also scraped.

```[proxy]```: ```true or false``` 

# License & Thanks 
This tool was developed by me in defense by @Onestepcom00[https://github.com/onestepcom00]
