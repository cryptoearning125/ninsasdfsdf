import * as React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, UploadCloud, CheckCircle, Clock, XCircle } from 'lucide-react';

// Reusable component for file input
const FileInput = ({ id, label, file, setFile, preview }: { id: string, label: string, file: File | null, setFile: (file: File | null) => void, preview: string | null }) => (
    <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg">
        <label htmlFor={id} className="cursor-pointer">
            {preview ? (
                <img src={preview} alt={`${label} preview`} className="w-full h-32 object-contain rounded-md mb-2" />
            ) : (
                <UploadCloud size={40} className="mx-auto text-gray-400 mb-2" />
            )}
            <p className="text-sm text-purple-500 dark:text-purple-400 font-semibold">{file ? 'Change file' : label}</p>
            {file && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{file.name}</p>}
        </label>
        <input id={id} type="file" className="hidden" accept="image/png, image/jpeg" onChange={e => setFile(e.target.files?.[0] || null)} />
    </div>
);

// View for 'not-verified' and 'rejected' statuses
const UploadView = ({ isRejected }: { isRejected: boolean }) => {
    const { submitIdentityDocs, isLoading } = useAuth();
    const [idFrontFile, setIdFrontFile] = React.useState<File | null>(null);
    const [idBackFile, setIdBackFile] = React.useState<File | null>(null);
    const [selfieFile, setSelfieFile] = React.useState<File | null>(null);
    const [idFrontPreview, setIdFrontPreview] = React.useState<string | null>(null);
    const [idBackPreview, setIdBackPreview] = React.useState<string | null>(null);
    const [selfiePreview, setSelfiePreview] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string>('');

    const handleFileChange = (file: File | null, setPreview: (url: string | null) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    React.useEffect(() => { handleFileChange(idFrontFile, setIdFrontPreview); }, [idFrontFile]);
    React.useEffect(() => { handleFileChange(idBackFile, setIdBackPreview); }, [idBackFile]);
    React.useEffect(() => { handleFileChange(selfieFile, setSelfiePreview); }, [selfieFile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idFrontFile || !idBackFile || !selfieFile) {
            setError('Please upload all three required documents.');
            return;
        }
        setError('');
        try {
            await submitIdentityDocs({ idFrontFile, idBackFile, selfieFile });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Submission failed.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 space-y-6 shadow-sm w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white">Submit Your Documents</h2>
            {isRejected && (
                <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
                    <XCircle size={16}/> Your previous submission was rejected. Please re-upload clear images.
                </div>
            )}
             {error && (
                <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
                    <XCircle size={16}/> {error}
                </div>
            )}
            <div className="grid grid-cols-1 gap-4">
                <FileInput id="id-front" label="Upload ID Front" file={idFrontFile} setFile={setIdFrontFile} preview={idFrontPreview} />
                <FileInput id="id-back" label="Upload ID Back" file={idBackFile} setFile={setIdBackFile} preview={idBackPreview} />
                <FileInput id="selfie" label="Upload Selfie with ID" file={selfieFile} setFile={setSelfieFile} preview={selfiePreview} />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-slate-500 transition flex justify-center items-center">
                {isLoading ? <Loader className="animate-spin" /> : 'Submit for Verification'}
            </button>
        </form>
    );
};

// View for 'pending' status
const PendingView = () => (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 text-center shadow-sm w-full max-w-md mx-auto">
        <Clock size={64} className="mx-auto text-yellow-500 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verification Pending</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            Your documents have been submitted and are currently under review. This usually takes 1-2 business days.
        </p>
    </div>
);

// View for 'verified' status
const VerifiedView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 text-center shadow-lg w-full max-w-md mx-auto">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Certified</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Your identity has been successfully verified.</p>
            
            <div className="text-left mt-8 p-4 bg-gray-100 dark:bg-slate-900/50 rounded-lg space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Name</span>
                    <span className="font-semibold text-slate-800 dark:text-white">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">User ID</span>
                    <span className="font-mono text-slate-800 dark:text-white">{user?.uid}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className="font-semibold text-green-500">Verified</span>
                </div>
            </div>

            <button
                onClick={() => navigate('/settings')}
                className="mt-8 w-full py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
                Back to Settings
            </button>
        </div>
    );
};

const IdentityAuthenticationScreen = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const renderContent = () => {
        switch (user?.identityStatus) {
            case 'pending':
                return <PendingView />;
            case 'verified':
                return <VerifiedView />;
            case 'rejected':
                return <UploadView isRejected={true} />;
            case 'not-verified':
            default:
                return <UploadView isRejected={false} />;
        }
    };
    
    return (
        <div className="animate-fade-in bg-gray-50 dark:bg-black min-h-screen">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between h-16 px-4 max-w-screen-md mx-auto">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">Identity Authentication</h1>
                    <div className="w-10"></div>
                </div>
            </header>
            <main className="p-4 flex items-center justify-center" style={{minHeight: 'calc(100vh - 4rem)'}}>
                {user ? renderContent() : <Loader className="animate-spin" />}
            </main>
        </div>
    );
};

export default IdentityAuthenticationScreen;