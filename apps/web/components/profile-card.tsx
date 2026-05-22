"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useUser, useAuth } from "@clerk/nextjs";

export function ProfileCard(props: React.ComponentProps<"div">) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  return (
    <div {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>User account information</CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoaded ? (
            <div>Loading user...</div>
          ) : !isSignedIn ? (
            <div>No user signed in.</div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">{user.fullName || "—"}</div>

              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">
                {user.primaryEmailAddress?.emailAddress || "—"}
              </div>

              <div className="text-sm text-muted-foreground">ID</div>
              <div className="font-mono text-xs">{user.id || "—"}</div>

              <div className="flex gap-2 pt-3">
                <Button onClick={() => console.log("user object:", user)}>
                  Log user
                </Button>
                <Button variant="outline" onClick={() => signOut()}>
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileCard;
