import { AlertTriangle, Info, Pencil, Save, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Password from '@/components/settings/password';
import Verification from '@/components/settings/verification';
import { InstanceInfo, User } from 'eludris-api-types/v0.4.0-alpha1';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Cropper, { ReactCropperElement } from 'react-cropper';
import { Alert, AlertTitle } from '@/components/ui/alert';

import { Label } from '@/components/ui/label';
import Profile from '../profile';
import { Input } from '../ui/input';
import { useEffect, useRef, useState } from 'react';
import { restClient } from '@/lib/client-provider';
import { getBase64, urltoFile as urlToFile } from '@/lib/utils';

export default function Settings({
  me,
  setMe,
  instanceInfo,
}: {
  me: User;
  setMe: (user: User) => void;
  instanceInfo: InstanceInfo;
}) {
  const [mePreview, setMePreview] = useState<User>(me);
  const [avatar, setAvatar] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [avatarOverride, setAvatarOverride] = useState<string | undefined>(
    undefined,
  );

  const displayNameDirty =
    mePreview.display_name !== '' && mePreview.display_name !== me.display_name;
  const bioDirty = mePreview.bio !== '' && mePreview.bio !== me.bio;
  const avatarDirty = avatarOverride !== undefined;
  const isDirty = displayNameDirty || bioDirty || avatarDirty;
  useEffect(() => {
    setMePreview(me);
  }, [me]);

  return (
    <div className="flex h-full  flex-col items-center gap-5 p-5">
      <Tabs defaultValue="account" className="h-full w-full md:max-w-[50vw]">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="account">
            Account
          </TabsTrigger>
          <TabsTrigger className="w-full" value="profile">
            Profile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className=" h-full">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Change your account settings here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label>Username</Label>
                    <span className="flex font-medium">{me.username}</span>
                  </div>
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </p>
                <p className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label>Email</Label>
                    <span className="flex font-medium">{me.email}</span>
                  </div>
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </p>
              </div>
              <hr className="border-gray-300" />
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold leading-none tracking-tight">
                  Security and Authentication
                </h2>
                <Verification me={me} setMe={setMe} />
                <Password />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              {isDirty && (
                <Alert variant="destructive" className="shake mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-normal">
                    You have unsaved changes!
                  </AlertTitle>
                </Alert>
              )}
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Change your profile settings here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Preview</Label>
                <Profile
                  user={mePreview}
                  avatarOverride={avatarOverride}
                  instanceInfo={instanceInfo}
                />
              </div>
              <hr />
              <div className="flex flex-col gap-2">
                <Label>Display Name</Label>
                <Input
                  value={mePreview.display_name ?? undefined}
                  onChange={evt =>
                    setMePreview({
                      ...mePreview,
                      display_name: evt.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Bio</Label>
                <Textarea
                  className="resize-none"
                  value={mePreview.bio ?? undefined}
                  onChange={evt =>
                    setMePreview({
                      ...mePreview,
                      bio: evt.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Avatar</Label>
                <div className="flex gap-2">
                  <Dialog
                    open={avatar !== null}
                    onOpenChange={() => setAvatar(null)}
                  >
                    <DialogContent>
                      <DialogHeader>Crop your image!</DialogHeader>
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle className="font-normal">
                          Cropping animated images will remove the animation.
                        </AlertTitle>
                      </Alert>
                      <Cropper
                        ref={cropperRef}
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                        }}
                        src={avatar ?? undefined}
                        // Cropper.js options
                        aspectRatio={1}
                        minContainerWidth={0}
                        minContainerHeight={0}
                        guides={false}
                      />
                      <div
                        className="flex gap-1
                      "
                      >
                        <Button
                          className="w-full"
                          onClick={() => {
                            if (cropperRef.current) {
                              setAvatarOverride(
                                cropperRef.current?.cropper
                                  .getCroppedCanvas()
                                  .toDataURL(),
                              );
                            }
                            setAvatar(null);
                          }}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          className="w-full"
                          variant="ghost"
                          onClick={() => setAvatar(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={async () => {
                      const ele = document.createElement('input');
                      ele.type = 'file';

                      ele.click();
                      await new Promise(resolve => {
                        ele.addEventListener('change', resolve, {
                          once: true,
                        });
                      });

                      setAvatar(
                        (await getBase64(
                          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                          ele.files?.[0]!,
                        )!) as unknown as string,
                      );
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Change Avatar
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={async () => {
                      setMe(
                        await restClient.updateProfile({
                          avatar: null,
                        }),
                      );
                      await restClient.downloadFile({
                        bucket: 'avatars',
                        id: me.avatar!,
                      });
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove Avatar
                  </Button>
                </div>
                <hr />
                <div className="flex gap-1">
                  <Button
                    className="w-fit"
                    disabled={!isDirty}
                    onClick={async () => {
                      let avatar = undefined;
                      if (avatarOverride) {
                        console.log(avatarOverride);
                        const fileData = await restClient.uploadFile({
                          bucket: 'avatars',
                          file: await urlToFile(avatarOverride, 'avatar.png')!,
                          spoiler: false,
                        });
                        avatar = fileData.id;
                      }
                      await restClient.updateProfile({
                        avatar: avatar ?? undefined,
                        bio: bioDirty ? mePreview.bio : undefined,
                        display_name: displayNameDirty
                          ? mePreview.display_name
                          : undefined,
                      });

                      setMe(mePreview);
                      setAvatarOverride(undefined);
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    className="w-fit"
                    variant="ghost"
                    disabled={!isDirty}
                    onClick={() => {
                      setMePreview(me);
                      setAvatarOverride(undefined);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
