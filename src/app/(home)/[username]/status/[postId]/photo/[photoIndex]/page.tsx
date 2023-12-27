import { redirect } from "next/navigation";

type PhotoIndexPageProps = {
  params: {
    photoIndex: string;
    postId: string;
    username: string;
  };
};

export default async function PhotoIndexPage({ params }: PhotoIndexPageProps) {
  if (params.username && params.photoIndex && params.photoIndex) {
    const url = `/${params.username}/status/${params.postId}/photo/${params.photoIndex}`;
    return redirect(url);
  }

  return null;
}
