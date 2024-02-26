import PhotoModal from "@/app/(home)/@photoModal/_components/photo-modal";

type PageProps = {
  params: {
    username: string;
    postId: string;
    photoIndex: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <PhotoModal
      username={params.username}
      postId={params.postId}
      photoIndex={params.photoIndex}
    />
  );
}
