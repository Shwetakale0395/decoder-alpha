import { useEffect, useState } from "react";
import { instance } from "../axios";
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    useIonToast
} from "@ionic/react";
import { environment } from "../environments/environment";
import {Link, useLocation} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function StackedSearch({ foo, onSubmit }: any) {

    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();
    const [formAddalertWalletAddress, setFormAddalertWalletAddress] = useState('');
    const [formLoadingAddalertWalletAddress, setFormLoadingAddalertWalletAddress] = useState(false); // form loading
    const [alertWalletAddress, setAlertWalletAddress] = useState('');
    const walletAddress = useSelector(
        (state: RootState) => state.wallet.walletAddress
    );

    // const [alertNewTokensModalOpen, setAlertNewTokensModalOpen] = useState(false); // model open or not

    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const devMode = query.get('devMode');

    /**
     * Use Effects
     */
    /**
     * Use Effects
     */
    useEffect(() => {
        instance
            .get(`${environment.backendApi}/currentUser`)
            .then((res: any) => setAlertWalletAddress(res.data.user.walletAddress));
    });

    // fill in their wallet from 'connect wallet', if set...
    // useEffect(() => {
    //     // @ts-ignore
    //     setFormAddalertWalletAddress(walletAddress);
    // }, [walletAddress]);

    /**
     * Functions
     */
        // const clickedAlertNewTokens = (val: boolean) => {
        //     setAlertNewTokensModalOpen(val);
        //     // setPopoverOpened(null);
        // }

        // in the form for alert on a token - submit button clicked
        // Should remove if unsubscribing
    const modifyAlertWalletSubmit = (shouldRemove: boolean) => {

            if ((!formAddalertWalletAddress || formAddalertWalletAddress.length !== 44) && !shouldRemove) {
                present({
                    message: 'Error - please enter a single, valid SOL wallet address',
                    color: 'danger',
                    duration: 5000
                });
                return;
            }

            setFormLoadingAddalertWalletAddress(true);

            setFormAddalertWalletAddress(''); // clear the form
            // setMultWalletAryFromCookie(cookies.get('multWalletsAry')); // set array to show user on frontend

            instance
                .post(`${environment.backendApi}/receiver/modifyAlertWallet`, {
                    walletAddress: formAddalertWalletAddress || null,
                    shouldRemove
                })
                .then((res) => {
                    const actionVerb = shouldRemove ? 'removed' : 'added';
                    present({
                        message: `Successfully ${actionVerb} the alert wallet address`,
                        color: 'success',
                        duration: 5000
                    });

                }).catch(err => {
                console.error(err);
                present({
                    message: err.msg,
                    color: 'danger',
                    duration: 5000
                });
            }).finally(() => setFormLoadingAddalertWalletAddress(false));

            /**
             * TO DO-alerts: alerts!
             *
             * in the UI tell the user the alert is going to discord over DMs
             *
             * once done:
             * - test this by sending yourself tokens between wallets
             * - add to the intro on top of fox page what this is ... then renam the cookie)
             * - update docs.sol
             *
             * ONCE IN PROD:
             * - look for enable:enable ... make it so you are able to remove the alert (unsub etc...)
             * - add a new section to home page ...to view recent alerts?
             */

        }

    /**
     * Renders
     */
    return (
        <>

            {/* TODO-alerts: enable */}
            {/* hidden={true}   */}
            <div hidden={!devMode} className="secondary-bg-forced m-1 p-4 rounded-xl">
                <h4 className={`font-medium ${window.location.href.includes('fnt') ? 'text-red-600 font-medium' : ''}`}>
                    Alerts on New WL Tokens to your Wallet
                </h4>

                <div
                    className="ml-3 mr-3 mb-2 relative mt-2 bg-gradient-to-b from-bg-primary to-bg-secondary p-3 rounded-xl">
                    <div className="font-medium">
                        <p>
                            This alerts you when any WL Token (that is also listed on Fox Token Market) gets added to your wallet.
                            Add a single SOL wallet address below.
                            The alert will be sent to you via a Discord DM by our bot.
                            At this time, <a className="underline text-blue-500" target="_blank" href="https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-">you must enable DMs from all users in our server</a> (note we will NEVER DM you with mint links).
                        </p>
                    </div>
                </div>

                <div className="ml-3 mr-3">
                    <IonItem hidden={!!alertWalletAddress}>
                        <IonLabel position="stacked" className="font-bold">
                            SOL Wallet Address
                        </IonLabel>
                        <IonInput onIonChange={(e) =>
                            setFormAddalertWalletAddress(e.detail.value!)
                        }
                                  value={formAddalertWalletAddress}
                                  placeholder="ex. 91q2zKjAATs28sdXT5rbtKddSU81BzvJtmvZGjFj54iU" />
                    </IonItem>
                    <div hidden={!alertWalletAddress}>Your current alert wallet: {alertWalletAddress}</div>
                    <IonButton
                        color="primary"
                        className="mt-5"
                        hidden={formLoadingAddalertWalletAddress || !!alertWalletAddress}
                        onClick={() => modifyAlertWalletSubmit(false)}
                    >
                        Submit
                    </IonButton>
                    <IonButton
                        color="danger"
                        className="mt-5"
                        hidden={formLoadingAddalertWalletAddress || !alertWalletAddress}
                        onClick={() => modifyAlertWalletSubmit(true)}
                    >
                        Unsubscribe
                    </IonButton>

                    {/*<IonButton*/}
                    {/*    hidden={!multWalletAryFromCookie}*/}
                    {/*    color="danger"*/}
                    {/*    className="mt-5"*/}
                    {/*    onClick={() => resetMultWallets()}*/}
                    {/*>*/}
                    {/*    Reset Stored Wallets*/}
                    {/*</IonButton>*/}

                    <div hidden={!formLoadingAddalertWalletAddress}>Loading...</div>
                </div>
            </div>
            <hr className="m-5" />


            <h3 className="text-xl font-medium mb-3">Discord Managed Alerts</h3>

            <div className="secondary-bg-forced m-1 p-4 rounded-xl">
                {/*bg-yellow-800*/}
                <h4 className={`font-medium ${window.location.href.includes('fnn') ? 'text-red-600 font-medium' : ''}`}>
                    New Fox WL Token Market Names
                </h4>
                The <a href="https://discord.com/channels/925207817923743794/951513272132182066" target="_blank" className="underline">#analytics-etc</a> channel in Discord
                and the home page of the site shows when WL tokens get official names by the Famous Fox team,
                or when a user of SOL Decoder adds a custom name to one.
                <br />
                Visit <a href="https://discord.com/channels/925207817923743794/938996145529712651 target=_blank" className="underline">#self-roles</a> in Discord and get the <b>@fox-wl-alerts</b> role to get alerts when this happens
            </div>

            <div className="secondary-bg-forced m-1 p-4 rounded-xl">
                <h4 className={`font-medium ${window.location.href.includes('ma') ? 'text-red-600 font-medium' : ''}`}>
                    Mint Alerts (parsed from Discord)
                </h4>
                The <a href="https://discord.com/channels/925207817923743794/925215482561302529" target="_blank" className="underline">#mint-alerts-automated</a> channel in Discord
                and the <Link to={'mintstats'} className="underline">Mint Stats</Link> page of the site is a live feed that parses links from the discords we watch. It alerts when any link could contain a new mint, before or while it is released. The mint must be linked from two discords before it shows up. On Discord, Candy Machine ID and mint details are also posted, if found.
                <br />
                Visit <a href="https://discord.com/channels/925207817923743794/938996145529712651 target=_blank" className="underline">#self-roles</a> in Discord and get the <b>@Minter</b> role to get alerts when this happens
            </div>

        </>
    );
}

export default StackedSearch;