// ProofMe Content Authentication Smart Contract
// Written in Motoko for Internet Computer Protocol (ICP)

import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor ContentProof {
    
    // Types
    public type ProofRecord = {
        hash: Text;
        owner: Principal;
        timestamp: Int;
        fileName: Text;
        fileType: Text;
        verified: Bool;
    };

    public type OwnerInfo = {
        owner: Principal;
        timestamp: Int;
        fileName: Text;
        fileType: Text;
        verified: Bool;
    };

    // Storage
    private stable var proofEntries: [(Text, ProofRecord)] = [];
    private var proofs = Map.HashMap<Text, ProofRecord>(0, Text.equal, Text.hash);
    
    private stable var ownerContentEntries: [(Principal, [Text])] = [];
    private var ownerContent = Map.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);

    // Initialize from stable storage
    system func preupgrade() {
        proofEntries := Iter.toArray(proofs.entries());
        ownerContentEntries := Iter.toArray(ownerContent.entries());
    };

    system func postupgrade() {
        proofs := Map.fromIter<Text, ProofRecord>(proofEntries.vals(), proofEntries.size(), Text.equal, Text.hash);
        ownerContent := Map.fromIter<Principal, [Text]>(ownerContentEntries.vals(), ownerContentEntries.size(), Principal.equal, Principal.hash);
        proofEntries := [];
        ownerContentEntries := [];
    };

    // Add a new content proof to the blockchain
    public func addProof(
        hash: Text, 
        fileName: Text, 
        fileType: Text,
        caller: Principal
    ) : async Result.Result<Bool, Text> {
        
        // Check if hash already exists
        switch (proofs.get(hash)) {
            case (?existing) {
                return #err("Content hash already exists with owner: " # Principal.toText(existing.owner));
            };
            case null {
                // Create new proof record
                let proof: ProofRecord = {
                    hash = hash;
                    owner = caller;
                    timestamp = Time.now();
                    fileName = fileName;
                    fileType = fileType;
                    verified = true;
                };

                // Store the proof
                proofs.put(hash, proof);

                // Update owner's content list
                let currentContent = switch (ownerContent.get(caller)) {
                    case (?content) { content };
                    case null { [] };
                };
                let updatedContent = Array.append<Text>(currentContent, [hash]);
                ownerContent.put(caller, updatedContent);

                return #ok(true);
            };
        };
    };

    // Verify a content proof by hash
    public query func verifyProof(hash: Text) : async Result.Result<OwnerInfo, Text> {
        switch (proofs.get(hash)) {
            case (?proof) {
                let ownerInfo: OwnerInfo = {
                    owner = proof.owner;
                    timestamp = proof.timestamp;
                    fileName = proof.fileName;
                    fileType = proof.fileType;
                    verified = proof.verified;
                };
                return #ok(ownerInfo);
            };
            case null {
                return #err("Content hash not found");
            };
        };
    };

    // Get all proofs owned by a specific principal
    public query func getOwnerProofs(owner: Principal) : async [ProofRecord] {
        switch (ownerContent.get(owner)) {
            case (?contentHashes) {
                let ownerProofs = Array.mapFilter<Text, ProofRecord>(
                    contentHashes,
                    func(hash: Text) : ?ProofRecord {
                        proofs.get(hash)
                    }
                );
                return ownerProofs;
            };
            case null {
                return [];
            };
        };
    };

    // Get total number of verified content pieces
    public query func getTotalProofs() : async Nat {
        proofs.size()
    };

    // Check if a hash exists (simple boolean check)
    public query func hashExists(hash: Text) : async Bool {
        switch (proofs.get(hash)) {
            case (?_) { true };
            case null { false };
        };
    };

    // Get proof details by hash
    public query func getProofDetails(hash: Text) : async Result.Result<ProofRecord, Text> {
        switch (proofs.get(hash)) {
            case (?proof) {
                return #ok(proof);
            };
            case null {
                return #err("Proof not found");
            };
        };
    };

    // Update verification status (admin only - you may want to add access control)
    public func updateVerificationStatus(hash: Text, verified: Bool, caller: Principal) : async Result.Result<Bool, Text> {
        switch (proofs.get(hash)) {
            case (?proof) {
                if (proof.owner != caller) {
                    return #err("Only the owner can update verification status");
                };
                
                let updatedProof: ProofRecord = {
                    hash = proof.hash;
                    owner = proof.owner;
                    timestamp = proof.timestamp;
                    fileName = proof.fileName;
                    fileType = proof.fileType;
                    verified = verified;
                };
                
                proofs.put(hash, updatedProof);
                return #ok(true);
            };
            case null {
                return #err("Proof not found");
            };
        };
    };

    // Get content count for an owner
    public query func getOwnerContentCount(owner: Principal) : async Nat {
        switch (ownerContent.get(owner)) {
            case (?content) { content.size() };
            case null { 0 };
        };
    };
}