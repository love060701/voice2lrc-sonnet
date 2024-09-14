import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState(null);
  const [lrcContent, setLrcContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('apiKey', apiKey);
    formData.append('file', file);

    try {
      const response = await fetch('/api/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      setLrcContent(data.lrcContent);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the audio.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([lrcContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lyrics.lrc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Audio to LRC Converter</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="apiKey" className="block mb-2">Gemini API Key:</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="audioFile" className="block mb-2">Upload Audio File (mp3, wav, aac, flac):</label>
          <input
            type="file"
            id="audioFile"
            accept=".mp3,.wav,.aac,.flac"
            onChange={handleFileChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isLoading ? 'Processing...' : 'Process Audio'}
        </button>
      </form>
      {lrcContent && (
        <div>
          <h2 className="text-xl font-bold mb-2">Generated LRC Content:</h2>
          <pre className="bg-gray-100 p-4 rounded mb-4">{lrcContent}</pre>
          <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">
            Download LRC File
          </button>
        </div>
      )}
    </div>
  );
}
