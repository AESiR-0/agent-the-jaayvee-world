interface QRCardProps {
  code: string;
  status: 'assigned' | 'activated';
  merchantName?: string;
  activationDate?: string;
}

export default function QRCard({ code, status, merchantName, activationDate }: QRCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activated':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleQRClick = () => {
    const url = `https://thejaayveeworld.com/ease?merchantId=${code}&role=merchant`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-soft p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{code}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      
      {merchantName && (
        <p className="text-sm text-foreground/70 mb-2">
          <span className="font-medium">Merchant:</span> {merchantName}
        </p>
      )}
      
      {activationDate && (
        <p className="text-sm text-foreground/70 mb-4">
          <span className="font-medium">Activated:</span> {new Date(activationDate).toLocaleDateString()}
        </p>
      )}
      
      <button
        onClick={handleQRClick}
        className="w-full px-4 py-2 border border-accent text-accent rounded-xl hover:bg-accent hover:text-white transition-colors"
      >
        View QR Link
      </button>
    </div>
  );
}
