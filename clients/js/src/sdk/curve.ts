import { createSignerFromKeypair, Keypair, Pda, PublicKey, Umi } from "@metaplex-foundation/umi";
import { findAssociatedTokenPda, SPL_ASSOCIATED_TOKEN_PROGRAM_ID, SPL_TOKEN_PROGRAM_ID } from "@metaplex-foundation/mpl-toolbox";
import {
    findMetadataPda,
} from "@metaplex-foundation/mpl-token-metadata";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import { createBondingCurve, CreateBondingCurveInstructionDataArgs, fetchBondingCurve, findBondingCurvePda, findBrandVaultPda, findCreatorVaultPda, findPlatformVaultPda, findPresaleVaultPda, swap, SwapInstructionArgs } from "../generated";
import { PumpFunSDK } from "./pump-Fun";
import { claimCreatorVesting } from '../generated/instructions/claimCreatorVesting';

export class CurveSDK {
    PumpFun: PumpFunSDK;
    umi: Umi;

    mint: PublicKey;
    userTokenAccount: Pda;

    bondingCurvePda: Pda;
    bondingCurveTokenAccount: Pda;

    mintMetaPda: Pda;

    creatorVaultPda: Pda;
    creatorVaultTokenAccount: Pda;

    presaleVaultPda: Pda;
    presaleVaultTokenAccount: Pda;

    // brandAuthorityPda:Pda;
    brandVaultPda: Pda;
    brandVaultTokenAccount: Pda;

    platformVaultPda: Pda;
    platformVaultTokenAccount: Pda;

    fetchData() {
        return fetchBondingCurve(this.umi, this.bondingCurvePda[0]);
    }

    swap(params: {
        direction: "buy" | "sell",
    } & Pick<SwapInstructionArgs, "exactInAmount" | "minOutAmount">) {
        return swap(this.umi, {
            global: this.PumpFun.globalPda[0],
            user: this.umi.identity,
            baseIn: params.direction !== "buy",
            exactInAmount: params.exactInAmount,
            minOutAmount: params.minOutAmount,
            mint: this.mint,
            bondingCurve: this.bondingCurvePda[0],
            bondingCurveTokenAccount: this.bondingCurveTokenAccount[0],
            userTokenAccount: this.userTokenAccount[0],
            platformVault: this.platformVaultPda[0],
            clock: fromWeb3JsPublicKey(SYSVAR_CLOCK_PUBKEY),
            associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
            ...this.PumpFun.evtAuthAccs,
        });
    }

    createBondingCurve(params: CreateBondingCurveInstructionDataArgs, mintKp: Keypair, brandAuthority?: PublicKey) {
        // check mintKp is this.mint
        if (mintKp.publicKey.toString() !== this.mint.toString()) {
            throw new Error("wrong mintKp provided");
        }
        const txBuilder = createBondingCurve(this.umi, {
            global: this.PumpFun.globalPda[0],

            creator: this.umi.identity,
            mint: createSignerFromKeypair(this.umi, mintKp),

            bondingCurve: this.bondingCurvePda[0],
            bondingCurveTokenAccount: this.bondingCurveTokenAccount[0],

            creatorVault: this.creatorVaultPda[0],
            creatorVaultTokenAccount: this.creatorVaultTokenAccount[0],

            presaleVault: this.presaleVaultPda[0],
            presaleVaultTokenAccount: this.presaleVaultTokenAccount[0],

            // selected brand authority or creator
            brandAuthority: brandAuthority || this.umi.identity.publicKey,

            brandVault: this.brandVaultPda[0],
            brandVaultTokenAccount: this.brandVaultTokenAccount[0],
            platformVault: this.platformVaultPda[0],
            platformVaultTokenAccount: this.platformVaultTokenAccount[0],


            metadata: this.mintMetaPda[0],

            ...this.PumpFun.evtAuthAccs,
            associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
            clock: fromWeb3JsPublicKey(SYSVAR_CLOCK_PUBKEY),
            ...params,
        })
        return txBuilder;
    }

    constructor(sdk: PumpFunSDK, mint: PublicKey) {
        this.PumpFun = sdk;
        this.umi = sdk.umi;
        this.mint = mint;
        this.userTokenAccount = findAssociatedTokenPda(this.umi, {
            mint: this.mint,
            owner: this.umi.identity.publicKey,
        });


        this.bondingCurvePda = findBondingCurvePda(this.umi, {
            mint: this.mint,
        });
        this.bondingCurveTokenAccount = findAssociatedTokenPda(this.umi, {
            mint: this.mint,
            owner: this.bondingCurvePda[0],
        });
        this.mintMetaPda = findMetadataPda(this.umi, {
            mint: this.mint,
        });


        this.creatorVaultPda = findCreatorVaultPda(this.umi, {
            mint: this.mint,
        });
        this.creatorVaultTokenAccount = findAssociatedTokenPda(this.umi, {
            mint: this.mint,
            owner: this.creatorVaultPda[0],
        });


        this.presaleVaultPda = findPresaleVaultPda(this.umi, {
            mint: this.mint,
        });
        this.presaleVaultTokenAccount = findAssociatedTokenPda(this.umi, {
            mint: this.mint,
            owner: this.presaleVaultPda[0],
        });


        this.brandVaultPda = findBrandVaultPda(this.umi, {
            mint: this.mint,
        });
        this.brandVaultTokenAccount = findAssociatedTokenPda(this.umi, {
            mint: this.mint,
            owner: this.brandVaultPda[0],
        });


        this.platformVaultPda = findPlatformVaultPda(this.umi, {
            mint: this.mint,
        });
        this.platformVaultTokenAccount = findAssociatedTokenPda(this.umi, {
            mint: this.mint,
            owner: this.platformVaultPda[0],
        });
    }

    claimCreatorVesting() {
        const txBuilder = claimCreatorVesting(this.umi, {
            global: this.PumpFun.globalPda[0],
            mint: this.mint,
            creator: this.umi.identity,
            bondingCurve: this.bondingCurvePda[0],
            userTokenAccount: this.userTokenAccount[0],
            creatorVault: this.creatorVaultPda[0],
            creatorVaultTokenAccount: this.creatorVaultTokenAccount[0],
            clock: fromWeb3JsPublicKey(SYSVAR_CLOCK_PUBKEY),
            tokenProgram: SPL_TOKEN_PROGRAM_ID,
            associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
            ...this.PumpFun.evtAuthAccs,
        });
        return txBuilder;
    }


}
