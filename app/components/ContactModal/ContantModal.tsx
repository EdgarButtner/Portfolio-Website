import { useState } from "react"
import confetti from "canvas-confetti";

export default function ContactModal({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    {/* Page Status */}
    const [ status, setStatus ] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to send');
            
            {/* Confetti and close Modal */}
            setStatus('success');
            console.log('Email sent!');
            
            confetti();
            setTimeout(() => {
                setStatus('idle');
                onClose();
            }, 500);

        } catch (error) {  
            setStatus('error');
            console.error('Error sending email:', error);
            alert('Sorry, something went wrong. Please try again later.');
        }
    };

    const inputClass = "w-full bg-transparent border border-accent rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-colors";

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        
        {/* Dark overlay behind modal - click to close */}
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
  
        {/* Modal box */}
        <div className="relative bg-black text-white border border-accent rounded-2xl p-8 w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold mb-6">Get In Touch!</h2>
          
          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Example@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Get in touch with me!"
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

            {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-400 transition-colors"
            >
              {status === 'sending' ? 'Sending...' : 'Send'}
            </button>
            <button onClick={onClose} className="px-4 py-2 border border-gray-600 text-white rounded-full text-sm hover:border-white transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    );
}
