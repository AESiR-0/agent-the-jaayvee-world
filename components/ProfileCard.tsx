interface ProfileData {
  walletBalance: number;
  referralLink: string;
  level: string;
  totalCommission: number;
  displayName: string;
  agentId: string;
}

interface ProfileCardProps {
  profile: ProfileData;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const copyReferralLink = () => {
    navigator.clipboard.writeText(profile.referralLink);
    // You could add a toast notification here
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-soft p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Profile</h2>
        <p className="text-foreground/70">Welcome back, {profile.displayName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-accent-light rounded-xl p-4">
          <h3 className="text-sm font-medium text-foreground/70 mb-2">Wallet Balance</h3>
          <p className="text-2xl font-bold text-accent">₹{profile.walletBalance.toLocaleString()}</p>
        </div>
        
        <div className="bg-accent-light rounded-xl p-4">
          <h3 className="text-sm font-medium text-foreground/70 mb-2">Total Commission</h3>
          <p className="text-2xl font-bold text-accent">₹{profile.totalCommission.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Agent Level
          </label>
          <div className="px-4 py-2 bg-accent-light border border-accent rounded-xl">
            <span className="text-accent font-medium">{profile.level}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Referral Link
          </label>
          <div className="flex">
            <input
              type="text"
              value={profile.referralLink}
              readOnly
              className="flex-1 px-4 py-2 border border-border rounded-l-xl bg-accent-light text-foreground"
            />
            <button
              onClick={copyReferralLink}
              className="px-4 py-2 border border-accent text-accent rounded-r-xl hover:bg-accent hover:text-white transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Agent ID
          </label>
          <div className="px-4 py-2 bg-accent-light border border-accent rounded-xl">
            <span className="text-accent font-mono">{profile.agentId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
