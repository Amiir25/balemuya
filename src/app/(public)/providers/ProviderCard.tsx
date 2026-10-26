import Image from "next/image";
import Link from "next/link";

type Props = {
  provider: {
    id: string;
    headline: string;
    address: string;
    priceFrom: number;
    priceUnit: string;
    photoUrl: string;
    ratingAvg: number;
    reviewCount: number;
    user: { name: string };
  };
};

export default function ProviderCard({ provider: p }: Props) {
  return (
    <Link href={`/providers/${p.id}`} className="block overflow-hidden rounded-xl border transition hover:shadow-md">
      <div className="relative h-40 w-full bg-gray-100">
        <Image
          src={p.photoUrl}
          alt={p.user.name}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{p.user.name}</h3>
        <p className="text-sm text-gray-600">{p.headline}</p>
        <p className="mt-2 text-sm">
            ⭐ {p.ratingAvg.toFixed(1)}{" "}
            <span className="text-gray-500">({p.reviewCount})</span>
        </p>
        <p className="mt-1 text-sm text-gray-500">
            {p.address} . from {p.priceFrom} ETB {p.priceUnit}
        </p>
      </div>
    </Link>
  );
}
