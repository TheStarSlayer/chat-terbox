import React, { useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [txt, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type?.startsWith("image")) {
        toast.error("Invalid file type. Please select an image.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!txt.trim() && !imagePreview) return;

    try {
        await sendMessage({
            text: txt.trim(),
            image: imagePreview
        }) ;
        setText("");
        removeImage();           
    } 
    catch (error) {
        console.error("Failed to send message!", error);
    }
  };
  
  return (
    <div className="p-4 w-full">
        { imagePreview && (
            <div className="mb-3 flex items-center gap-2">
                <div className="relative">
                    <img 
                        src={imagePreview}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                    />

                    <button
                        onClick={removeImage}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                        flex items-center justify-center"
                        type='button'
                    >
                        <X className='size-3' />
                    </button>
                </div>
            </div>
        )}

        <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
        >
            <div className="flex-1 flex gap-2">
                <input 
                    type='text'
                    className='w-full input input-bordered rounded-lg input-sm sm:input-md'
                    placeholder='Type a message...'
                    value={txt}
                    onChange={(e) => setText(e.target.value)}
                />
                <input
                    type="file"
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                />

                <button
                    type="button"
                    className={`hidden sm:flex btn btn-circle
                        ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Image size={20} />
                </button>
            </div>
            <button
                type="submit"
                className="btn btn-circle"
                disabled={!txt.trim() && !imagePreview}
            >
                <Send size={22} />
            </button>
        </form>
    </div>
  );
};

export default MessageInput;
